import { View, StyleSheet, ScrollView, Alert, Dimensions, Modal, TouchableOpacity, FlatList, Image, PanResponder } from 'react-native';
import { Text, Button, Card, Avatar, List, Divider, Chip, IconButton, SegmentedButtons, TextInput } from 'react-native-paper';
import { useState, useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

type UserRole = 'student' | 'volunteer';
type Screen = 'login' | 'quiz' | 'dashboard' | 'chats' | 'volunteerInfo' | 'settings' | 'admin';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  currentGrade: number;
  age: number;
  school: string;
  subjectPreference: string;
  availability: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  role: UserRole;
  isAdmin: boolean;
  volunteerProfile?: {
    subjectsToTutor: string[];
    gradeLevelsComfortable: number[];
    isComplete: boolean;
  };
}

const SCHOOLS = [
  'Francis A. Desmares School',
  'Hunterdon County Polytech School',
  'Reading-Fleming Intermediate School',
  'Robert Hunter School',
  'JP Case Middle School',
  'Barley Sheaf School',
  'Three Bridges School',
  'Woodfern Elementary School',
  'High Bridge Elementary School',
  'Union Township Elementary School',
  'Clinton Public School',
  'Round Valley School',
  'Lebanon Borough School',
  'Patrick McGaheran School',
  'Franklin Township School',
  'Whitehouse School',
  'Readington Middle School',
  'Holland Brook School',
  'The Midland School',
  'Stony Brook Elementary School',
  'North Hunterdon High School',
  'South Hunterdon Regional High School',
  'Hunterdon Central Regional High School',
];

const SUBJECTS = [
  'Math',
  'English/Language Arts',
  'Science',
  'History/Social Studies',
  'General Homework Help',
];

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const AGES = Array.from({ length: 18 }, (_, i) => i + 8);
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [showSchoolPicker, setShowSchoolPicker] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [bottomNavIndex, setBottomNavIndex] = useState(0);
  
  // Real accounts database
  const [allAccounts, setAllAccounts] = useState<User[]>([]);
  const [allChats, setAllChats] = useState<any[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Edit profile state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    grade: 9,
    school: '',
    subjectPreference: '',
    availability: {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
    volunteerProfile: {
      subjectsToTutor: [] as string[],
      gradeLevelsComfortable: [] as number[],
    },
  });

  // Quiz form state
  const [quizData, setQuizData] = useState({
    firstName: '',
    lastName: '',
    currentGrade: 9,
    age: 14,
    school: SCHOOLS[0],
    subjectPreference: SUBJECTS[0],
    availability: {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
    },
  });

  // Swipe gesture handler
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Disable swipes when in an active chat
      if (activeChat) return false;
      
      // Only activate for horizontal swipes (with some tolerance)
      const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      const hasMinimumMovement = Math.abs(gestureState.dx) > 15;
      
      return isHorizontal && hasMinimumMovement;
    },
    onPanResponderRelease: (evt, gestureState) => {
      const SWIPE_THRESHOLD = 80; // Increased threshold for clearer intent
      
      // Only allow swipes on main screens (dashboard, chats, volunteerInfo, settings)
      const swipeableScreens: Screen[] = ['dashboard', 'chats', 'volunteerInfo', 'settings'];
      if (!swipeableScreens.includes(currentScreen)) return;
      
      const isStudent = user?.role === 'student';
      
      // Swipe right (go left in navigation)
      if (gestureState.dx > SWIPE_THRESHOLD) {
        if (currentScreen === 'chats') {
          setCurrentScreen('dashboard');
          setBottomNavIndex(0);
        } else if (currentScreen === 'volunteerInfo' && isStudent) {
          setCurrentScreen('chats');
          setBottomNavIndex(1);
        } else if (currentScreen === 'settings') {
          // For students: settings -> volunteerInfo, For volunteers: settings -> chats
          if (isStudent) {
            setCurrentScreen('volunteerInfo');
            setBottomNavIndex(2);
          } else {
            setCurrentScreen('chats');
            setBottomNavIndex(1);
          }
        }
      }
      
      // Swipe left (go right in navigation)
      else if (gestureState.dx < -SWIPE_THRESHOLD) {
        if (currentScreen === 'dashboard') {
          setCurrentScreen('chats');
          setBottomNavIndex(1);
        } else if (currentScreen === 'chats') {
          // For students: chats -> volunteerInfo, For volunteers: chats -> settings
          if (isStudent) {
            setCurrentScreen('volunteerInfo');
            setBottomNavIndex(2);
          } else {
            setCurrentScreen('settings');
            setBottomNavIndex(3);
          }
        } else if (currentScreen === 'volunteerInfo' && isStudent) {
          setCurrentScreen('settings');
          setBottomNavIndex(3);
        }
      }
    },
  });

  // Utility function to format timestamps
  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!dateObj || isNaN(dateObj.getTime())) return '';
    
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  // Handle opening edit profile modal
  const handleOpenEditProfile = () => {
    if (!user) return;
    
    setEditProfileData({
      grade: user.grade || 9,
      school: user.school || '',
      subjectPreference: user.subjectPreference || '',
      availability: user.availability || {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
      },
      volunteerProfile: {
        subjectsToTutor: user.volunteerProfile?.subjectsToTutor || [],
        gradeLevelsComfortable: user.volunteerProfile?.gradeLevelsComfortable || [],
      },
    });
    setShowEditProfile(true);
  };

  // Handle saving edited profile
  const handleSaveProfile = () => {
    if (!user) return;

    // Update user state
    const updatedUser = {
      ...user,
      grade: editProfileData.grade,
      school: editProfileData.school,
      subjectPreference: editProfileData.subjectPreference,
      availability: editProfileData.availability,
      volunteerProfile: user.role === 'volunteer' ? {
        ...user.volunteerProfile,
        subjectsToTutor: editProfileData.volunteerProfile.subjectsToTutor,
        gradeLevelsComfortable: editProfileData.volunteerProfile.gradeLevelsComfortable,
        isComplete: editProfileData.volunteerProfile.subjectsToTutor.length > 0 && editProfileData.volunteerProfile.gradeLevelsComfortable.length > 0,
      } : user.volunteerProfile,
    };

    setUser(updatedUser);

    // Update in allAccounts
    setAllAccounts(prev => prev.map(acc => 
      acc.id === user.id ? updatedUser : acc
    ));

    setShowEditProfile(false);
    Alert.alert('Success!', 'Your profile has been updated.');
  };

  // Get real volunteers from allAccounts that match the user's criteria
  let realVolunteers: any[] = [];
  try {
    if (user?.role === 'student' && Array.isArray(allAccounts)) {
      realVolunteers = allAccounts.filter(account => {
        try {
          if (!account || typeof account !== 'object') return false;
          if (account.role !== 'volunteer' || !account.volunteerProfile?.isComplete) return false;
          
          // Get student's grade (check both grade and currentGrade for backwards compatibility)
          const studentGrade = user.grade || user.currentGrade;
          
          // Must be comfortable with student's grade level
          if (studentGrade && account.volunteerProfile?.gradeLevelsComfortable) {
            if (!account.volunteerProfile.gradeLevelsComfortable.includes(studentGrade)) return false;
          }
          
          // Must teach the student's subject preference
          if (user.subjectPreference && account.volunteerProfile?.subjectsToTutor) {
            if (!account.volunteerProfile.subjectsToTutor.includes(user.subjectPreference)) return false;
          }
          
          // Must have at least one overlapping availability day
          if (user.availability && account.availability) {
            const hasOverlap = Object.keys(user.availability).some(day => 
              user.availability[day as keyof typeof user.availability] && 
              account.availability[day as keyof typeof account.availability]
            );
            if (!hasOverlap) return false;
          }
          
          return true;
        } catch {
          return false;
        }
      }).map(volunteer => {
        try {
          const matchingDays = user.availability && volunteer.availability ? Object.keys(user.availability)
            .filter(day => user.availability[day as keyof typeof user.availability] && volunteer.availability[day as keyof typeof volunteer.availability])
            .map(day => DAY_LABELS[day] || day) : [];
          
          return {
            id: volunteer.id,
            firstName: volunteer.firstName,
            lastName: volunteer.lastName,
            subjectsToTutor: volunteer.volunteerProfile?.subjectsToTutor || [],
            gradeLevelsComfortable: volunteer.volunteerProfile?.gradeLevelsComfortable || [],
            school: volunteer.school,
            availability: volunteer.availability,
            matchingDays,
            matchScore: matchingDays.length, // Score based on number of matching days
          };
        } catch {
          return null;
        }
      }).filter(Boolean).sort((a, b) => (b?.matchScore || 0) - (a?.matchScore || 0)); // Sort by best match
    }
  } catch (error) {
    console.error('Error calculating realVolunteers:', error);
    realVolunteers = [];
  }

  // Get real chats involving the current user
  let userChats: any[] = [];
  try {
    if (user && Array.isArray(allChats)) {
      userChats = allChats.filter(chat => {
        try {
          return chat && typeof chat === 'object' && (chat.studentId === user.id || chat.volunteerId === user.id);
        } catch {
          return false;
        }
      }).map(chat => {
        try {
          if (!chat || !chat.messages || !Array.isArray(chat.messages)) return null;
          
          const isStudent = chat.studentId === user.id;
          const otherUser = Array.isArray(allAccounts) ? allAccounts.find(acc => acc && acc.id === (isStudent ? chat.volunteerId : chat.studentId)) : null;
          const lastMsg = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
          
          return {
            id: chat.id,
            volunteerName: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown',
            lastMessage: lastMsg?.text || 'No messages yet',
            timestamp: lastMsg ? formatTime(lastMsg.timestamp) : '',
            unread: 0,
          };
        } catch {
          return null;
        }
      }).filter(Boolean);
    }
  } catch (error) {
    console.error('Error calculating userChats:', error);
    userChats = [];
  }

  // ==================== HANDLERS ====================
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    // Show modal for email input (works on both Android and iOS)
    setEmailModalVisible(true);
  };

  const processGoogleSignIn = async (email: string) => {
    try {
      console.log('🔐 Processing Google Sign In for:', email);
      
      if (!email || !email.includes('@')) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }
      
      // Check if admin email
      const isAdmin = email.toLowerCase() === 'inform.growtogether@gmail.com';
      console.log('👤 Is admin:', isAdmin);
      
      // Extract first and last name from email (mock)
      const emailName = email.split('@')[0];
      const nameParts = emailName.split('.');
      const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'User';
      const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : '';
      
      // Check if account already exists
      const existingAccount = allAccounts.find(acc => acc.email === email);
      console.log('🔍 Existing account found:', !!existingAccount);
      
      if (existingAccount) {
        // Sign in to existing account
        console.log('✅ Signing in existing user');
        setUser(existingAccount);
        setCurrentScreen('dashboard');
        setEmailModalVisible(false);
        setEmailInput('');
        Alert.alert('Welcome Back!', `Signed in as ${existingAccount.firstName} ${existingAccount.lastName}`);
      } else {
        // New account - go to quiz
        console.log('🆕 Creating new account - going to quiz');
        console.log('📝 Name extracted:', { firstName, lastName });
        
        // Pre-fill quiz data with extracted names
        setQuizData(prev => ({
          ...prev,
          firstName,
          lastName,
        }));
        
        setUser({
          id: `user-${Date.now()}`,
          email,
          firstName,
          lastName,
          role: isAdmin ? 'student' : 'student', // Admin users are also students but with isAdmin flag
          school: '',
          currentGrade: 9,
          subjectPreference: '',
          availability: {},
          isAdmin,
        });
        
        console.log('🎯 Navigating to quiz screen');
        setCurrentScreen('quiz');
        setEmailModalVisible(false);
        setEmailInput('');
        
        if (isAdmin) {
          Alert.alert('Admin Account', 'You are signing in with the admin account. Complete the quiz to set up your profile.');
        }
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
  };

  const handleQuizSubmit = () => {
    // Create/update user with quiz data
    const updatedUser: User = {
      id: user?.id || `user-${Date.now()}`,
      email: user?.email || 'student@school.com',
      firstName: quizData.firstName,
      lastName: quizData.lastName,
      currentGrade: quizData.currentGrade,
      age: quizData.age,
      school: quizData.school,
      subjectPreference: quizData.subjectPreference,
      availability: quizData.availability,
      role: 'student',
      isAdmin: user?.isAdmin || false,
    };
    
    // Add to allAccounts if new
    setAllAccounts(prev => {
      const exists = prev.find(acc => acc.id === updatedUser.id);
      if (!exists) {
        return [...prev, updatedUser];
      }
      return prev.map(acc => acc.id === updatedUser.id ? updatedUser : acc);
    });
    
    setUser(updatedUser);
    setCurrentScreen('dashboard');
  };

  const handleStartChat = (volunteer: any) => {
    if (!user) return;
    
    // Check if chat already exists
    const existingChat = allChats.find(chat => 
      (chat.studentId === user.id && chat.volunteerId === volunteer.id)
    );
    
    if (existingChat) {
      // Use existing chat
      setSelectedVolunteer(volunteer);
      setActiveChat(existingChat);
      setMessageInput('');
      setBottomNavIndex(1);
      setCurrentScreen('chats');
      return;
    }
    
    // Create new chat
    const newChat = {
      id: `chat-${Date.now()}`,
      studentId: user.id,
      volunteerId: volunteer.id,
      messages: [
        { 
          id: 1, 
          sender: 'system', 
          text: `You are now connected with ${volunteer.firstName} ${volunteer.lastName}. Send a message to start the conversation!`, 
          timestamp: new Date() 
        }
      ],
      createdAt: new Date(),
    };
    
    setAllChats(prev => [...prev, newChat]);
    setSelectedVolunteer(volunteer);
    setActiveChat(newChat);
    setMessageInput('');
    setBottomNavIndex(1);
    setCurrentScreen('chats');
  };

  const handleBottomNavChange = (index: number) => {
    setBottomNavIndex(index);
    
    // Map bottom nav index to screen
    const screenMap: Record<number, Screen> = {
      0: 'dashboard',
      1: 'chats',
      2: 'profile',
      3: 'settings',
    };
    
    // If switching away from chat, clear active chat
    if (index !== 1) {
      setActiveChat(null);
      setSelectedVolunteer(null);
      setMessageInput('');
    }
    
    setCurrentScreen(screenMap[index]);
  };

  const handleOpenChat = (chatId: string) => {
    const chat = allChats.find(c => c.id === chatId);
    if (chat) {
      setActiveChat(chat);
      setBottomNavIndex(1);
      setCurrentScreen('chats');
    }
  };

  const handlePickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageMessage = {
          id: Date.now(),
          sender: user?.role || 'student',
          text: '',
          image: result.assets[0].uri,
          timestamp: new Date(),
        };

        // Update allChats
        setAllChats(prev => prev.map(chat => {
          if (chat.id === activeChat?.id) {
            return {
              ...chat,
              messages: [...chat.messages, imageMessage],
            };
          }
          return chat;
        }));

        // Update activeChat
        setActiveChat((prev: any) => ({
          ...prev,
          messages: [...prev.messages, imageMessage],
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat || !user) return;

    const newMessage = {
      id: Date.now(),
      sender: user.role,
      text: messageInput.trim(),
      timestamp: new Date(),
    };

    // Update allChats
    setAllChats(prev => prev.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }
      return chat;
    }));

    // Update activeChat
    setActiveChat((prev: any) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    setMessageInput('');
  };

  const handleCompleteChat = () => {
    if (!activeChat) return;
    
    Alert.alert(
      'Complete Chat?',
      'This will permanently close the conversation for both you and the student. The chat will be removed and cannot be accessed again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            // Remove the chat from allChats
            setAllChats(prev => prev.filter(chat => chat.id !== activeChat.id));
            
            // Clear active chat state and navigate to dashboard
            setActiveChat(null);
            setSelectedVolunteer(null);
            setCurrentScreen('dashboard');
            
            Alert.alert(
              'Chat Completed!',
              'The chat has been closed and removed. Your volunteer hours for this session will be reviewed.'
            );
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentScreen('login');
    setActiveChat(null);
    setSelectedVolunteer(null);
  };

  const toggleAvailability = (day: string) => {
    setQuizData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day as keyof typeof prev.availability],
      },
    }));
  };

  // Zoom Modal Component (always rendered)
  const renderZoomModal = () => (
    <Modal
      visible={!!zoomedImage}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setZoomedImage(null)}
    >
      <View style={styles.imageZoomOverlay}>
        <TouchableOpacity 
          style={styles.imageZoomCloseArea}
          activeOpacity={1}
          onPress={() => setZoomedImage(null)}
        >
          <View style={styles.imageZoomHeader}>
            <IconButton
              icon="close"
              size={28}
              iconColor="#FFF"
              onPress={() => setZoomedImage(null)}
              style={styles.imageZoomCloseButton}
            />
          </View>
          <View style={styles.imageZoomContainer}>
            <Image
              source={{ uri: zoomedImage || '' }}
              style={styles.imageZoomed}
              resizeMode="contain"
            />
          </View>
          <Text variant="bodySmall" style={styles.imageZoomHint}>
            Tap anywhere to close
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  // ==================== LOGIN SCREEN ====================
  if (currentScreen === 'login' && !user) {
    return (
      <>
        {renderZoomModal()}
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.loginScrollContent}>
          <MaterialCommunityIcons name="school" size={80} color="#2196F3" />
          <Text variant="displaySmall" style={styles.appTitle}>
            GrowTogether
          </Text>
          <Text variant="bodyLarge" style={styles.tagline}>
            Connect students with volunteer tutors
          </Text>
          <Text variant="bodyLarge" style={styles.tagline}>
            within your school district
          </Text>

          <Button
            mode="contained"
            onPress={handleGoogleSignIn}
            icon="google"
            style={styles.googleButton}
            contentStyle={styles.googleButtonContent}
          >
            Sign in with Google
          </Button>

          <Text variant="bodySmall" style={styles.footerText}>
            By signing in, you agree to our Terms & Privacy Policy
          </Text>
          
          <Text variant="bodySmall" style={styles.infoText}>
            GrowTogether connects students with volunteer tutors within your school district. Sign in with your Google account to get started!
          </Text>
        </ScrollView>

        {/* Email Input Modal */}
        <Modal
          visible={emailModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setEmailModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.emailModalContainer}>
              <Text variant="headlineSmall" style={styles.emailModalTitle}>
                Sign in with Google
              </Text>
              <Text variant="bodyMedium" style={styles.emailModalSubtitle}>
                Enter your Gmail address to continue
              </Text>
              
              <TextInput
                mode="outlined"
                label="Email Address"
                value={emailInput}
                onChangeText={setEmailInput}
                placeholder="your.name@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.emailInput}
              />
              
              <Text variant="bodySmall" style={styles.adminHint}>
                Use your school district email address to sign in
              </Text>
              
              <View style={styles.emailModalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setEmailModalVisible(false);
                    setEmailInput('');
                  }}
                  style={styles.emailModalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={() => processGoogleSignIn(emailInput)}
                  style={styles.emailModalButton}
                  icon="login"
                >
                  Sign In
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      </>
    );
  }

  // ==================== INFORMATION QUIZ ====================
  if (currentScreen === 'quiz') {
    return (
      <>
        {renderZoomModal()}
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text variant="headlineMedium" style={styles.screenTitle}>
            Complete Your Profile
          </Text>
          <Text variant="bodyMedium" style={styles.screenSubtitle}>
            Help us match you with the perfect tutor
          </Text>

          <Card style={styles.quizCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>Basic Information</Text>
              
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                mode="outlined"
                value={quizData.firstName}
                onChangeText={(text) => setQuizData(prev => ({ ...prev, firstName: text }))}
                placeholder="Enter your first name"
                style={styles.textInput}
              />

              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                mode="outlined"
                value={quizData.lastName}
                onChangeText={(text) => setQuizData(prev => ({ ...prev, lastName: text }))}
                placeholder="Enter your last name"
                style={styles.textInput}
              />

              <Text style={styles.label}>Current Grade *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {GRADES.map(grade => (
                  <Chip
                    key={grade}
                    selected={quizData.currentGrade === grade}
                    onPress={() => setQuizData(prev => ({ ...prev, currentGrade: grade }))}
                    style={styles.chip}
                  >
                    {grade}
                  </Chip>
                ))}
              </ScrollView>

              <Text style={styles.label}>Age *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {AGES.map(age => (
                  <Chip
                    key={age}
                    selected={quizData.age === age}
                    onPress={() => setQuizData(prev => ({ ...prev, age: age }))}
                    style={styles.chip}
                  >
                    {age}
                  </Chip>
                ))}
              </ScrollView>

              <Text style={styles.label}>School *</Text>
              <TouchableOpacity onPress={() => setShowSchoolPicker(true)}>
                <Card style={styles.dropdownCard}>
                  <Card.Content style={styles.dropdownContent}>
                    <Text variant="bodyMedium">{quizData.school}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
                  </Card.Content>
                </Card>
              </TouchableOpacity>

              <Text style={styles.label}>Subject Preference *</Text>
              {SUBJECTS.map(subject => (
                <Card
                  key={subject}
                  style={[
                    styles.radioCard,
                    quizData.subjectPreference === subject && styles.radioCardSelected
                  ]}
                  onPress={() => setQuizData(prev => ({ ...prev, subjectPreference: subject }))}
                >
                  <Card.Content style={styles.radioContent}>
                    <MaterialCommunityIcons
                      name={quizData.subjectPreference === subject ? 'radiobox-marked' : 'radiobox-blank'}
                      size={24}
                      color="#2196F3"
                    />
                    <Text style={styles.radioText}>{subject}</Text>
                  </Card.Content>
                </Card>
              ))}

              <Text style={styles.label}>Availability *</Text>
              <Text variant="bodySmall" style={styles.hint}>
                Select the days you're available for tutoring
              </Text>
              {DAYS.map(day => (
                <Card
                  key={day}
                  style={[
                    styles.radioCard,
                    quizData.availability[day as keyof typeof quizData.availability] && styles.radioCardSelected
                  ]}
                  onPress={() => toggleAvailability(day)}
                >
                  <Card.Content style={styles.radioContent}>
                    <MaterialCommunityIcons
                      name={quizData.availability[day as keyof typeof quizData.availability] ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={24}
                      color="#2196F3"
                    />
                    <Text style={styles.radioText}>{DAY_LABELS[day]}</Text>
                  </Card.Content>
                </Card>
              ))}
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleQuizSubmit}
            style={styles.submitButton}
            disabled={!quizData.firstName || !quizData.lastName}
          >
            Save & Continue
          </Button>
        </ScrollView>

        {/* School Picker Modal */}
        <Modal
          visible={showSchoolPicker}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowSchoolPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text variant="titleLarge">Select School</Text>
                <IconButton icon="close" onPress={() => setShowSchoolPicker(false)} />
              </View>
              <FlatList
                data={SCHOOLS}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.schoolItem}
                    onPress={() => {
                      setQuizData(prev => ({ ...prev, school: item }));
                      setShowSchoolPicker(false);
                    }}
                  >
                    <Text variant="bodyLarge" style={styles.schoolItemText}>
                      {item}
                    </Text>
                    {quizData.school === item && (
                      <MaterialCommunityIcons name="check" size={24} color="#2196F3" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
      </>
    );
  }

  // ==================== ADMIN DASHBOARD (Check First!) ====================
  if (currentScreen === 'dashboard' && user?.isAdmin) {
    // Calculate real statistics
    const totalUsers = allAccounts.length;
    const totalStudents = allAccounts.filter(acc => acc.role === 'student').length;
    const totalVolunteers = allAccounts.filter(acc => acc.role === 'volunteer').length;
    const activeChats = allChats.length;
    
    return (
      <>
        {renderZoomModal()}
        <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text variant="headlineSmall" style={styles.headerName}>
              Admin Panel <Chip style={styles.adminBadge}>Admin</Chip>
            </Text>
          </View>
          <IconButton
            icon="cog"
            size={28}
            onPress={() => setCurrentScreen('settings')}
          />
        </View>

        <ScrollView contentContainerStyle={styles.dashboardContent}>
          {/* System Stats */}
          <Text variant="titleLarge" style={styles.dashboardSectionTitle}>
            📊 System Statistics
          </Text>
          
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Card.Content>
                <Text variant="headlineMedium" style={styles.statNumber}>{totalUsers}</Text>
                <Text variant="bodyMedium">Total Users</Text>
              </Card.Content>
            </Card>
            
            <Card style={styles.statCard}>
              <Card.Content>
                <Text variant="headlineMedium" style={styles.statNumber}>{totalStudents}</Text>
                <Text variant="bodyMedium">Students</Text>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Card.Content>
                <Text variant="headlineMedium" style={styles.statNumber}>{totalVolunteers}</Text>
                <Text variant="bodyMedium">Volunteers</Text>
              </Card.Content>
            </Card>
            
            <Card style={styles.statCard}>
              <Card.Content>
                <Text variant="headlineMedium" style={styles.statNumber}>{activeChats}</Text>
                <Text variant="bodyMedium">Active Chats</Text>
              </Card.Content>
            </Card>
          </View>

          {/* User Management */}
          <Text variant="titleLarge" style={styles.dashboardSectionTitle}>
            👥 User Management ({totalUsers})
          </Text>
          
          {allAccounts.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.emptyTitle}>No users yet</Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  Users will appear here when they create accounts
                </Text>
              </Card.Content>
            </Card>
          ) : (
            allAccounts.map(account => (
              <Card key={account.id} style={styles.userCard}>
                <Card.Content>
                  <View style={styles.userCardHeader}>
                    <Avatar.Text 
                      size={40} 
                      label={`${account.firstName[0]}${account.lastName[0]}`}
                      style={account.role === 'student' ? styles.studentAvatar : account.role === 'volunteer' ? styles.volunteerAvatar : styles.adminAvatar}
                    />
                    <View style={styles.userCardInfo}>
                      <Text variant="titleMedium">{account.firstName} {account.lastName}</Text>
                      <Text variant="bodySmall">{account.email}</Text>
                      <View style={styles.userCardMeta}>
                        <Chip style={styles.roleChipSmall}>{account.role}</Chip>
                        <Text variant="bodySmall"> • {account.school}</Text>
                      </View>
                    </View>
                  </View>
                  {account.role === 'student' && !account.isAdmin && (
                    <View style={styles.userCardActions}>
                      <Button
                        mode="contained"
                        icon="account-arrow-up"
                        onPress={() => {
                          Alert.alert(
                            'Promote to Volunteer',
                            `Promote ${account.firstName} ${account.lastName} to a volunteer tutor?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Promote',
                                onPress: () => {
                                  // Update the account role
                                  setAllAccounts(prev => prev.map(acc => 
                                    acc.id === account.id 
                                      ? { ...acc, role: 'volunteer', volunteerProfile: { subjectsToTutor: [], gradeLevelsComfortable: [], isComplete: false, isDiscoverable: true } }
                                      : acc
                                  ));
                                  
                                  // Update if it's the current user
                                  if (user?.id === account.id) {
                                    setUser(prev => prev ? { ...prev, role: 'volunteer', volunteerProfile: { subjectsToTutor: [], gradeLevelsComfortable: [], isComplete: false, isDiscoverable: true } } : null);
                                  }
                                  
                                  Alert.alert('Success!', `${account.firstName} ${account.lastName} has been promoted to volunteer. They can now set up their volunteer profile.`);
                                }
                              }
                            ]
                          );
                        }}
                        style={styles.promoteButton}
                        buttonColor="#4CAF50"
                        compact
                      >
                        Promote to Volunteer
                      </Button>
                    </View>
                  )}
                </Card.Content>
              </Card>
            ))
          )}

          {/* Active Chats */}
          {allChats.length > 0 && (
            <>
              <Text variant="titleLarge" style={styles.dashboardSectionTitle}>
                💬 Active Chats ({activeChats})
              </Text>
              
              {allChats.filter(chat => chat && chat.messages).map(chat => {
                const student = allAccounts.find(acc => acc.id === chat.studentId);
                const volunteer = allAccounts.find(acc => acc.id === chat.volunteerId);
                const lastMsg = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
                
                if (!student || !volunteer) return null;
                
                return (
                  <Card key={chat.id} style={styles.chatCard}>
                    <Card.Content>
                      <Text variant="titleSmall">
                        {student?.firstName} {student?.lastName} ↔ {volunteer?.firstName} {volunteer?.lastName}
                      </Text>
                      <Text variant="bodySmall" style={styles.chatLastMessage}>
                        Last: "{lastMsg?.text?.substring(0, 50)}{lastMsg?.text && lastMsg.text.length > 50 ? '...' : ''}"
                      </Text>
                      <Text variant="bodySmall" style={styles.chatMeta}>
                        {chat.messages?.length || 0} messages • Started {formatTime(chat.createdAt)}
                      </Text>
                    </Card.Content>
                  </Card>
                );
              })}
            </>
          )}
        </ScrollView>

        {renderBottomNav()}
        </View>
      </>
    );
  }

  // ==================== STUDENT DASHBOARD ====================
  if (currentScreen === 'dashboard' && user?.role === 'student' && !user?.isAdmin) {
    return (
      <>
        {renderZoomModal()}
        <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text variant="headlineSmall" style={styles.headerName}>
              {user.firstName}
            </Text>
            <Text variant="bodyMedium" style={styles.headerGrade}>
              Grade {user.currentGrade}
            </Text>
          </View>
          <IconButton
            icon="cog"
            size={28}
            onPress={() => setCurrentScreen('settings')}
          />
        </View>

        <ScrollView contentContainerStyle={styles.dashboardContent}>
          <Text variant="titleLarge" style={styles.dashboardSectionTitle}>
            Potential Volunteers
          </Text>
          <Text variant="bodySmall" style={styles.dashboardSubtext}>
            Matched based on your subject, grade, and availability
          </Text>

          {realVolunteers.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <MaterialCommunityIcons name="account-search" size={48} color="#999" style={styles.emptyIcon} />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  No matches found
                </Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  Try updating your availability or subject preferences in Settings
                </Text>
              </Card.Content>
            </Card>
          ) : (
            realVolunteers.map(volunteer => {
              // Check if chat already exists with this volunteer
              const existingChat = allChats.find(chat => 
                chat.studentId === user?.id && chat.volunteerId === volunteer.id
              );
              
              return (
                <Card key={volunteer.id} style={styles.volunteerCard}>
                  <Card.Content>
                    <View style={styles.volunteerHeader}>
                      <Avatar.Text
                        size={56}
                        label={`${volunteer.firstName[0]}${volunteer.lastName[0]}`}
                        style={styles.volunteerAvatar}
                      />
                      <View style={styles.volunteerInfo}>
                        <Text variant="titleMedium" style={styles.volunteerName}>
                          {volunteer.firstName} {volunteer.lastName}
                        </Text>
                        <Text variant="bodySmall" style={styles.volunteerDetail}>
                          📚 {volunteer.subjectsToTutor.join(', ')}
                        </Text>
                        <Text variant="bodySmall" style={styles.volunteerDetail}>
                          🎓 Grades {Math.min(...volunteer.gradeLevelsComfortable)}-{Math.max(...volunteer.gradeLevelsComfortable)}
                        </Text>
                        <Text variant="bodySmall" style={styles.volunteerDetail}>
                          🏫 {volunteer.school}
                        </Text>
                        <Text variant="bodySmall" style={styles.volunteerAvailability}>
                          📅 Available: {volunteer.matchingDays.join(', ')}
                        </Text>
                        {existingChat && (
                          <Text variant="bodySmall" style={styles.activeChatBadge}>
                            💬 Active chat
                          </Text>
                        )}
                      </View>
                    </View>
                  </Card.Content>
                  <Card.Actions>
                    <Button 
                      mode={existingChat ? "outlined" : "contained"} 
                      onPress={() => handleStartChat(volunteer)}
                    >
                      {existingChat ? "Open Chat" : "Start Chat"}
                    </Button>
                  </Card.Actions>
                </Card>
              );
            })
          )}

          <View style={styles.swipeHints}>
            <Text variant="bodySmall" style={styles.swipeHint}>
              ← Swipe left to learn about volunteering
            </Text>
            <Text variant="bodySmall" style={styles.swipeHint}>
              Swipe right to view your chats →
            </Text>
          </View>
        </ScrollView>

        {renderBottomNav()}
        </View>
      </>
    );
  }

  // ==================== VOLUNTEER DASHBOARD ====================
  if (currentScreen === 'dashboard' && user?.role === 'volunteer') {
    const isProfileComplete = user.volunteerProfile?.isComplete || false;

    return (
      <>
        {renderZoomModal()}
        <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text variant="headlineSmall" style={styles.headerName}>
              {user.firstName} <Chip style={styles.volunteerBadge}>Volunteer</Chip>
            </Text>
          </View>
          <IconButton
            icon="cog"
            size={28}
            onPress={() => setCurrentScreen('settings')}
          />
        </View>

        <ScrollView contentContainerStyle={styles.dashboardContent}>
          {!isProfileComplete && (
            <Card style={styles.warningCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.warningTitle}>
                  ⚠️ Complete Your Volunteer Profile
                </Text>
                <Text variant="bodyMedium">
                  You need to complete your volunteer profile to be discoverable by students.
                </Text>
                <Button mode="contained" style={styles.warningButton} onPress={() => setCurrentScreen('settings')}>
                  Complete Profile
                </Button>
              </Card.Content>
            </Card>
          )}

          <Card style={styles.infoCard}>
            <Card.Content>
              <Text variant="titleMedium">ℹ️ How It Works</Text>
              <Text variant="bodyMedium" style={styles.infoText}>
                Students select you; you cannot initiate chats. When a student reaches out, you'll see their chat here.
              </Text>
            </Card.Content>
          </Card>

          {isProfileComplete && (
            <Card style={styles.discoveryCard}>
              <Card.Content>
                <Text variant="titleMedium">✅ Discoverable</Text>
                <Text variant="bodyMedium">
                  Your profile is complete and visible to students looking for help!
                </Text>
              </Card.Content>
            </Card>
          )}

          <Text variant="titleLarge" style={styles.dashboardSectionTitle}>
            Active Chats
          </Text>
          {(!Array.isArray(userChats) || userChats.length === 0) ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <MaterialCommunityIcons name="chat-outline" size={48} color="#999" style={styles.emptyIcon} />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  No active chats
                </Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  Students will reach out when they need help!
                </Text>
              </Card.Content>
            </Card>
          ) : (
            (Array.isArray(userChats) ? userChats : []).filter(chat => chat && chat.id).map(chat => (
              <Card key={chat.id} style={styles.chatPreviewCard} onPress={() => handleOpenChat(chat.id)}>
                <Card.Content>
                  <View style={styles.chatPreview}>
                    <Avatar.Text size={40} label={(chat.volunteerName && chat.volunteerName[0]) || '?'} />
                    <View style={styles.chatPreviewInfo}>
                      <Text variant="titleSmall">{chat.volunteerName || 'Unknown'}</Text>
                      <Text variant="bodySmall" style={styles.chatPreviewMessage}>
                        {chat.lastMessage || 'No message'}
                      </Text>
                    </View>
                    <View style={styles.chatPreviewMeta}>
                      <Text variant="bodySmall" style={styles.chatPreviewTime}>
                        {chat.timestamp || ''}
                      </Text>
                      {chat.unread > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{chat.unread}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>

        {renderBottomNav()}
        </View>
      </>
    );
  }

  // ==================== VOLUNTEER INFO PAGE ====================
  if (currentScreen === 'volunteerInfo') {
    return (
      <>
        {renderZoomModal()}
        <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.header}>
          <IconButton icon="arrow-left" onPress={() => setCurrentScreen('dashboard')} />
          <Text variant="headlineMedium">Become a Volunteer</Text>
        </View>

        <ScrollView contentContainerStyle={styles.volunteerInfoContent}>
          <MaterialCommunityIcons name="account-heart" size={80} color="#4CAF50" style={styles.volunteerInfoIcon} />
          
          <Text variant="headlineSmall" style={styles.volunteerInfoTitle}>
            Want to Help Students?
          </Text>
          
          <Text variant="bodyLarge" style={styles.volunteerInfoText}>
            Visit the GrowTogether Website to apply to become a volunteer tutor and help students in your school district succeed!
          </Text>

          <Button
            mode="contained"
            icon="open-in-new"
            onPress={() => Alert.alert('Opening Browser', 'This would open the GrowTogether website')}
            style={styles.volunteerInfoButton}
          >
            Open Website
          </Button>

          <Button mode="text" onPress={() => setCurrentScreen('dashboard')}>
            Back to Dashboard
          </Button>
        </ScrollView>
        </View>
      </>
    );
  }

  // ==================== CHATS SCREEN ====================
  if (currentScreen === 'chats' && user) {
    if (activeChat) {
      // Get the other user in the chat
      const isStudent = user.role === 'student';
      const otherUserId = isStudent ? activeChat.volunteerId : activeChat.studentId;
      const otherUser = allAccounts.find(acc => acc.id === otherUserId);
      
      if (!otherUser) {
        return (
          <>
            {renderZoomModal()}
            <View style={styles.container}>
            <View style={styles.header}>
              <IconButton icon="arrow-left" onPress={() => { 
                setCurrentScreen('dashboard');
                setTimeout(() => {
                  setActiveChat(null); 
                  setSelectedVolunteer(null); 
                  setMessageInput('');
                }, 100);
              }} />
              <Text variant="headlineMedium">Chat Error</Text>
            </View>
            <View style={styles.emptyCard}>
              <Text>User not found</Text>
            </View>
          </View>
          </>
        );
      }
      
      // Individual chat thread
      return (
        <>
          {renderZoomModal()}
          <View style={styles.container}>
          <View style={styles.chatHeader}>
            <IconButton icon="arrow-left" onPress={() => { 
              setCurrentScreen('dashboard');
              setTimeout(() => {
                setActiveChat(null); 
                setSelectedVolunteer(null); 
                setMessageInput('');
              }, 100);
            }} />
            <View style={styles.chatHeaderInfo}>
              <Text variant="titleMedium">{otherUser.firstName} {otherUser.lastName}</Text>
              <Text variant="bodySmall">
                {otherUser.role === 'volunteer' 
                  ? otherUser.volunteerProfile?.subjectsToTutor?.join(', ') || 'Volunteer'
                  : `Grade ${otherUser.currentGrade} Student`}
              </Text>
            </View>
            <Avatar.Text 
              size={40} 
              label={`${otherUser.firstName[0]}${otherUser.lastName[0]}`}
              style={styles.chatAvatar}
            />
          </View>

          <ScrollView 
            style={styles.chatMessages} 
            contentContainerStyle={styles.chatMessagesContent}
            ref={(ref) => {
              if (ref) {
                ref.scrollToEnd({ animated: true });
              }
            }}
          >
            {(Array.isArray(activeChat?.messages) ? activeChat.messages : []).map((msg: any) => {
              if (!msg || !msg.id) return null;
              
              const isSystemMessage = msg.sender === 'system';
              const isMyMessage = msg.sender === user?.role;
              
              return (
                <View key={msg.id} style={[
                  styles.messageContainer,
                  isSystemMessage && styles.systemMessageContainer,
                  isMyMessage && styles.myMessageContainer,
                ]}>
                  {!isSystemMessage && !isMyMessage && (
                    <Avatar.Text 
                      size={32} 
                      label={(otherUser?.firstName && otherUser.firstName[0]) || '?'}
                      style={styles.messageAvatar}
                    />
                  )}
                  <View style={[
                    styles.messageBubble,
                    isSystemMessage && styles.systemMessage,
                    isMyMessage && styles.myMessage,
                    !isMyMessage && !isSystemMessage && styles.theirMessage,
                  ]}>
                    {(msg as any).image ? (
                      <TouchableOpacity onPress={() => setZoomedImage((msg as any).image)}>
                        <Image 
                          source={{ uri: (msg as any).image }} 
                          style={styles.messageImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ) : (
                      <Text 
                        variant="bodyMedium" 
                        style={[
                          styles.messageText,
                          isMyMessage && styles.myMessageText,
                        ]}
                      >
                        {msg.text || ''}
                      </Text>
                    )}
                    <Text 
                      variant="bodySmall" 
                      style={[
                        styles.messageTime,
                        isMyMessage && styles.myMessageTime,
                      ]}
                    >
                      {msg.timestamp ? formatTime(msg.timestamp) : ''}
                    </Text>
                  </View>
                  {!isSystemMessage && isMyMessage && (
                    <Avatar.Text 
                      size={32} 
                      label={(user?.firstName && user.firstName[0]) || '?'}
                      style={styles.messageAvatar}
                    />
                  )}
                </View>
              );
            }).filter(Boolean)}
          </ScrollView>

          <View style={styles.chatInputContainer}>
            <View style={styles.messageInputWrapper}>
              <IconButton
                icon="image"
                size={24}
                iconColor="#666"
                onPress={handlePickImage}
                style={styles.imageButton}
              />
              <TextInput
                mode="outlined"
                value={messageInput}
                onChangeText={setMessageInput}
                placeholder="Type a message..."
                multiline
                maxLength={500}
                style={styles.messageInput}
                right={
                  <TextInput.Affix 
                    text={`${messageInput.length}/500`}
                    textStyle={{ fontSize: 10, color: '#999' }}
                  />
                }
              />
              <IconButton
                icon="send"
                size={28}
                iconColor="#2196F3"
                onPress={handleSendMessage}
                disabled={!messageInput.trim()}
                style={styles.sendButton}
              />
            </View>
            
            {user.role === 'volunteer' && (
              <View style={styles.chatActionsRow}>
                <Button 
                  mode="contained" 
                  onPress={handleCompleteChat}
                  icon="check-circle"
                  compact
                  style={styles.chatActionButton}
                >
                  Complete Chat
                </Button>
              </View>
            )}
        </View>
      </View>
      </>
      );
    }

    // Chat list
    return (
      <>
        {renderZoomModal()}
        <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.header}>
          <Text variant="headlineMedium">Messages</Text>
        </View>

        <ScrollView>
          {(!Array.isArray(userChats) || userChats.length === 0) ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <MaterialCommunityIcons name="chat-outline" size={48} color="#999" style={styles.emptyIcon} />
                <Text variant="titleMedium" style={styles.emptyTitle}>
                  No messages yet
                </Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  Start a conversation with a {user.role === 'student' ? 'tutor' : 'student'} to begin chatting.
                </Text>
              </Card.Content>
            </Card>
          ) : (
            (Array.isArray(userChats) ? userChats : []).filter(chat => chat && chat.id).map(chat => (
              <Card key={chat.id} style={styles.chatPreviewCard} onPress={() => handleOpenChat(chat.id)}>
                <Card.Content>
                  <View style={styles.chatPreview}>
                    <Avatar.Text size={48} label={(chat.volunteerName && chat.volunteerName[0]) || '?'} />
                    <View style={styles.chatPreviewInfo}>
                      <Text variant="titleMedium">{chat.volunteerName || 'Unknown'}</Text>
                      <Text variant="bodyMedium" style={styles.chatPreviewMessage}>
                        {chat.lastMessage || 'No message'}
                      </Text>
                    </View>
                    <View style={styles.chatPreviewMeta}>
                      <Text variant="bodySmall" style={styles.chatPreviewTime}>
                        {chat.timestamp || ''}
                      </Text>
                      {chat.unread > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{chat.unread}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>

        {renderBottomNav()}
        </View>
      </>
    );
  }

  // ==================== SETTINGS SCREEN ====================
  if (currentScreen === 'settings' && user) {
    // Safe access to user properties
    const safeUser = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      school: user.school || 'Not set',
      currentGrade: user.grade || user.currentGrade || 0,
      subjectPreference: user.subjectPreference || 'Not set',
      role: user.role || 'student',
      availability: user.availability || {},
      volunteerProfile: user.volunteerProfile || null,
    };
    
    const avatarLabel = `${safeUser.firstName[0] || '?'}${safeUser.lastName[0] || '?'}`;
    const availabilityText = safeUser.availability && typeof safeUser.availability === 'object' 
      ? Object.keys(safeUser.availability)
          .filter(day => safeUser.availability[day as keyof typeof safeUser.availability])
          .map(d => DAY_LABELS[d] || d)
          .join(', ') || 'Not set'
      : 'Not set';
    
    return (
      <>
        {renderZoomModal()}
        <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.header}>
          <Text variant="headlineMedium">Settings</Text>
          <IconButton icon="pencil" onPress={handleOpenEditProfile} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.settingsCard}>
            <Card.Content>
              {/* Profile Section */}
              <List.Section>
                <List.Subheader>Profile</List.Subheader>
                <List.Item
                  title={`${safeUser.firstName} ${safeUser.lastName}`}
                  description={safeUser.email}
                  left={props => <Avatar.Text size={40} label={avatarLabel} />}
                  right={props => <Chip style={styles.roleChip}>{safeUser.role}</Chip>}
                />
              </List.Section>

              <Divider style={styles.divider} />

              {/* Account Actions */}
              <List.Section>
                <List.Subheader>Account</List.Subheader>
                <List.Item
                  title="Name"
                  description={`${safeUser.firstName} ${safeUser.lastName}`}
                  left={props => <List.Icon {...props} icon="account" />}
                />
                <List.Item
                  title="Email"
                  description={safeUser.email}
                  left={props => <List.Icon {...props} icon="email" />}
                />
                <List.Item
                  title="School"
                  description={safeUser.school}
                  left={props => <List.Icon {...props} icon="school" />}
                />
                <List.Item
                  title="Grade"
                  description={safeUser.currentGrade ? `Grade ${safeUser.currentGrade}` : 'Not set'}
                  left={props => <List.Icon {...props} icon="book-education" />}
                />
                <List.Item
                  title="Subject Preference"
                  description={safeUser.subjectPreference}
                  left={props => <List.Icon {...props} icon="book-open-variant" />}
                />
                <List.Item
                  title="Availability"
                  description={availabilityText}
                  left={props => <List.Icon {...props} icon="calendar-clock" />}
                />
                {safeUser.role === 'volunteer' && (
                  <>
                    <Divider style={styles.divider} />
                    <List.Subheader>Volunteer Profile</List.Subheader>
                    <List.Item
                      title="Subjects to Tutor"
                      description={safeUser.volunteerProfile?.subjectsToTutor?.join(', ') || 'Not set'}
                      left={props => <List.Icon {...props} icon="brain" />}
                    />
                    <List.Item
                      title="Grade Levels"
                      description={safeUser.volunteerProfile?.gradeLevelsComfortable?.join(', ') || 'Not set'}
                      left={props => <List.Icon {...props} icon="numeric" />}
                    />
                  </>
                )}
              </List.Section>

            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleSignOut}
            icon="logout"
            style={styles.signOutButton}
            buttonColor="#F44336"
          >
            Sign Out
          </Button>
        </ScrollView>

        {renderBottomNav()}
      </View>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        onRequestClose={() => setShowEditProfile(false)}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.editProfileModal}>
          <View style={styles.editProfileContent}>
            <View style={styles.modalHeader}>
              <Text variant="headlineSmall">Edit Profile</Text>
              <IconButton icon="close" onPress={() => setShowEditProfile(false)} />
            </View>
            
            <ScrollView style={{ flex: 1 }}>
              <View style={{ padding: 16 }}>
                {/* Student-only fields */}
                {user?.role === 'student' && (
                  <>
                    {/* Grade */}
                    <Text variant="titleMedium" style={styles.label}>Grade</Text>
                    <TouchableOpacity 
                      style={styles.dropdownCard}
                      onPress={() => setShowGradeModal(true)}
                    >
                      <Card.Content>
                        <View style={styles.dropdownContent}>
                          <Text>{editProfileData.grade || 'Select Grade'}</Text>
                          <MaterialCommunityIcons name="chevron-down" size={24} />
                        </View>
                      </Card.Content>
                    </TouchableOpacity>

                    {/* School */}
                    <Text variant="titleMedium" style={styles.label}>School</Text>
                    <TouchableOpacity 
                      style={styles.dropdownCard}
                      onPress={() => setShowSchoolModal(true)}
                    >
                      <Card.Content>
                        <View style={styles.dropdownContent}>
                          <Text>{editProfileData.school || 'Select School'}</Text>
                          <MaterialCommunityIcons name="chevron-down" size={24} />
                        </View>
                      </Card.Content>
                    </TouchableOpacity>

                    {/* Subject Preference */}
                    <Text variant="titleMedium" style={styles.label}>Subject Preference</Text>
                    <TouchableOpacity 
                      style={styles.dropdownCard}
                      onPress={() => Alert.alert('Select Subject', 'Choose your subject preference', SUBJECTS.map(subject => ({
                        text: subject,
                        onPress: () => setEditProfileData(prev => ({ ...prev, subjectPreference: subject }))
                      })).concat([{ text: 'Cancel', style: 'cancel' }]))}
                    >
                      <Card.Content>
                        <View style={styles.dropdownContent}>
                          <Text>{editProfileData.subjectPreference || 'Select Subject'}</Text>
                          <MaterialCommunityIcons name="chevron-down" size={24} />
                        </View>
                      </Card.Content>
                    </TouchableOpacity>
                  </>
                )}

                {/* Availability */}
                <Text variant="titleMedium" style={styles.label}>Availability</Text>
                {Object.keys(editProfileData.availability).map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.radioCard,
                      editProfileData.availability[day as keyof typeof editProfileData.availability] && styles.radioCardSelected
                    ]}
                    onPress={() => setEditProfileData(prev => ({
                      ...prev,
                      availability: {
                        ...prev.availability,
                        [day]: !prev.availability[day as keyof typeof prev.availability]
                      }
                    }))}
                  >
                    <Card.Content>
                      <View style={styles.radioContent}>
                        <MaterialCommunityIcons
                          name={editProfileData.availability[day as keyof typeof editProfileData.availability] ? 'checkbox-marked' : 'checkbox-blank-outline'}
                          size={24}
                          color={editProfileData.availability[day as keyof typeof editProfileData.availability] ? '#007AFF' : '#666'}
                        />
                        <Text style={styles.radioText}>{DAY_LABELS[day] || day}</Text>
                      </View>
                    </Card.Content>
                  </TouchableOpacity>
                ))}

                {/* Volunteer-specific fields */}
                {user?.role === 'volunteer' && (
                  <>
                    <Text variant="titleMedium" style={styles.label}>Subjects to Tutor</Text>
                    <ScrollView horizontal style={styles.chipScroll}>
                      {SUBJECTS.map(subject => (
                        <Chip
                          key={subject}
                          selected={editProfileData.volunteerProfile.subjectsToTutor.includes(subject)}
                          onPress={() => setEditProfileData(prev => ({
                            ...prev,
                            volunteerProfile: {
                              ...prev.volunteerProfile,
                              subjectsToTutor: prev.volunteerProfile.subjectsToTutor.includes(subject)
                                ? prev.volunteerProfile.subjectsToTutor.filter(s => s !== subject)
                                : [...prev.volunteerProfile.subjectsToTutor, subject]
                            }
                          }))}
                          style={styles.chip}
                        >
                          {subject}
                        </Chip>
                      ))}
                    </ScrollView>

                    <Text variant="titleMedium" style={styles.label}>Grade Levels</Text>
                    <ScrollView horizontal style={styles.chipScroll}>
                      {GRADES.map(grade => (
                        <Chip
                          key={grade}
                          selected={editProfileData.volunteerProfile.gradeLevelsComfortable.includes(grade)}
                          onPress={() => setEditProfileData(prev => ({
                            ...prev,
                            volunteerProfile: {
                              ...prev.volunteerProfile,
                              gradeLevelsComfortable: prev.volunteerProfile.gradeLevelsComfortable.includes(grade)
                                ? prev.volunteerProfile.gradeLevelsComfortable.filter(g => g !== grade)
                                : [...prev.volunteerProfile.gradeLevelsComfortable, grade]
                            }
                          }))}
                          style={styles.chip}
                        >
                          {grade}
                        </Chip>
                      ))}
                    </ScrollView>
                  </>
                )}

                {/* Action Buttons */}
                <View style={styles.emailModalButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowEditProfile(false)}
                    style={[styles.emailModalButton, { flex: 1, marginRight: 8 }]}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSaveProfile}
                    style={[styles.emailModalButton, { flex: 1, marginLeft: 8 }]}
                  >
                    Save Changes
                  </Button>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Grade Selection Modal */}
      <Modal
        visible={showGradeModal}
        onRequestClose={() => setShowGradeModal(false)}
        animationType="slide"
        transparent
      >
        <View style={styles.emailModalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="headlineSmall">Select Grade</Text>
              <IconButton icon="close" onPress={() => setShowGradeModal(false)} />
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {GRADES.map(grade => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.radioCard,
                    editProfileData.grade === grade && styles.radioCardSelected
                  ]}
                  onPress={() => {
                    setEditProfileData(prev => ({ ...prev, grade }));
                    setShowGradeModal(false);
                  }}
                >
                  <Card.Content>
                    <View style={styles.radioContent}>
                      <MaterialCommunityIcons
                        name={editProfileData.grade === grade ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        size={24}
                        color={editProfileData.grade === grade ? '#007AFF' : '#666'}
                      />
                      <Text style={styles.radioText}>Grade {grade}</Text>
                    </View>
                  </Card.Content>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* School Selection Modal */}
      <Modal
        visible={showSchoolModal}
        onRequestClose={() => setShowSchoolModal(false)}
        animationType="slide"
        transparent
      >
        <View style={styles.emailModalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="headlineSmall">Select School</Text>
              <IconButton icon="close" onPress={() => setShowSchoolModal(false)} />
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {SCHOOLS.map(school => (
                <TouchableOpacity
                  key={school}
                  style={[
                    styles.radioCard,
                    editProfileData.school === school && styles.radioCardSelected
                  ]}
                  onPress={() => {
                    setEditProfileData(prev => ({ ...prev, school }));
                    setShowSchoolModal(false);
                  }}
                >
                  <Card.Content>
                    <View style={styles.radioContent}>
                      <MaterialCommunityIcons
                        name={editProfileData.school === school ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        size={24}
                        color={editProfileData.school === school ? '#007AFF' : '#666'}
                      />
                      <Text style={styles.radioText}>{school}</Text>
                    </View>
                  </Card.Content>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      </>
    );
  }

  // ==================== BOTTOM NAVIGATION ====================
  function renderBottomNav() {
    if (!user) return null;

    const handleNavPress = (screen: Screen) => {
      // Clear chat state when navigating away from chats
      if (screen !== 'chats') {
        setActiveChat(null);
        setSelectedVolunteer(null);
        setMessageInput('');
      }
      setCurrentScreen(screen);
    };

    return (
      <View style={styles.bottomNav}>
        <View style={styles.bottomNavContent}>
          <TouchableOpacity 
            style={styles.bottomNavItem}
            onPress={() => handleNavPress('dashboard')}
          >
            <MaterialCommunityIcons 
              name={currentScreen === 'dashboard' ? 'view-dashboard' : 'view-dashboard-outline'}
              size={28}
              color={currentScreen === 'dashboard' ? '#2196F3' : '#666'}
            />
            <Text 
              variant="labelSmall" 
              style={[
                styles.bottomNavLabel,
                currentScreen === 'dashboard' && styles.bottomNavLabelActive
              ]}
            >
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.bottomNavItem}
            onPress={() => handleNavPress('chats')}
          >
            <MaterialCommunityIcons 
              name={currentScreen === 'chats' ? 'chat' : 'chat-outline'}
              size={28}
              color={currentScreen === 'chats' ? '#2196F3' : '#666'}
            />
            <Text 
              variant="labelSmall" 
              style={[
                styles.bottomNavLabel,
                currentScreen === 'chats' && styles.bottomNavLabelActive
              ]}
            >
              Chats
            </Text>
          </TouchableOpacity>

          {user.role === 'student' && (
            <TouchableOpacity 
              style={styles.bottomNavItem}
              onPress={() => handleNavPress('volunteerInfo')}
            >
              <MaterialCommunityIcons 
                name={currentScreen === 'volunteerInfo' ? 'account-heart' : 'account-heart-outline'}
                size={28}
                color={currentScreen === 'volunteerInfo' ? '#2196F3' : '#666'}
              />
              <Text 
                variant="labelSmall" 
                style={[
                  styles.bottomNavLabel,
                  currentScreen === 'volunteerInfo' && styles.bottomNavLabelActive
                ]}
              >
                Volunteer
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.bottomNavItem}
            onPress={() => handleNavPress('settings')}
          >
            <MaterialCommunityIcons 
              name={currentScreen === 'settings' ? 'cog' : 'cog-outline'}
              size={28}
              color={currentScreen === 'settings' ? '#2196F3' : '#666'}
            />
            <Text 
              variant="labelSmall" 
              style={[
                styles.bottomNavLabel,
                currentScreen === 'settings' && styles.bottomNavLabelActive
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  bottomNav: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingBottom: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomNavContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  bottomNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 70,
  },
  bottomNavLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  bottomNavLabelActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  loginContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  loginScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 100,
  },
  loginDivider: {
    width: '100%',
    marginVertical: 40,
  },
  testAccountsTitle: {
    color: '#1C1C1E',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
  },
  testAccountsSubtitle: {
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 28,
    fontSize: 15,
  },
  testAccountCard: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  testAccountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testAccountInfo: {
    marginLeft: 12,
    flex: 1,
  },
  testLoginButton: {
    minWidth: 150,
    borderRadius: 12,
  },
  studentAvatar: {
    backgroundColor: '#007AFF',
  },
  volunteerAvatar: {
    backgroundColor: '#34C759',
  },
  adminAvatar: {
    backgroundColor: '#FF9500',
  },
  appTitle: {
    color: '#007AFF',
    fontWeight: '800',
    marginTop: 32,
    marginBottom: 12,
    fontSize: 34,
  },
  tagline: {
    color: '#8E8E93',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
  },
  googleButton: {
    marginTop: 56,
    minWidth: 280,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  googleButtonContent: {
    height: 58,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    paddingHorizontal: 32,
  },
  footerText: {
    color: '#999',
    textAlign: 'center',
  },
  infoText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  screenTitle: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 40,
    textAlign: 'center',
  },
  screenSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  quizCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  sectionTitle: {
    marginBottom: 20,
    color: '#1C1C1E',
    fontWeight: '700',
    fontSize: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 20,
    marginBottom: 10,
  },
  textInput: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  dropdownCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  schoolItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  schoolItemText: {
    flex: 1,
  },
  chipScroll: {
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
  },
  radioCard: {
    backgroundColor: '#FFF',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  radioCardSelected: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    marginLeft: 12,
    fontSize: 16,
  },
  hint: {
    color: '#999',
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 32,
    marginBottom: 40,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  settingsCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerName: {
    color: '#1C1C1E',
    fontWeight: '800',
    fontSize: 28,
  },
  headerGrade: {
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },
  dashboardContent: {
    padding: 20,
    paddingBottom: 100,
  },
  dashboardSectionTitle: {
    marginTop: 16,
    marginBottom: 16,
    color: '#1C1C1E',
    fontWeight: '700',
    fontSize: 22,
  },
  dashboardSubtext: {
    color: '#8E8E93',
    marginBottom: 20,
    fontSize: 15,
  },
  volunteerCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  volunteerHeader: {
    flexDirection: 'row',
  },
  volunteerAvatar: {
    backgroundColor: '#4CAF50',
  },
  volunteerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  volunteerName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  volunteerDetail: {
    color: '#666',
    marginTop: 2,
  },
  volunteerAvailability: {
    color: '#2196F3',
    marginTop: 4,
  },
  activeChatBadge: {
    color: '#4CAF50',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 13,
  },
  swipeHints: {
    marginTop: 24,
    alignItems: 'center',
  },
  swipeHint: {
    color: '#999',
    marginTop: 4,
  },
  emptyCard: {
    marginTop: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  volunteerBadge: {
    backgroundColor: '#34C759',
  },
  adminBadge: {
    backgroundColor: '#FF9500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCardSmall: {
    width: '48%',
    marginBottom: 12,
  },
  statNumber: {
    color: '#2196F3',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  activityCard: {
    marginBottom: 16,
  },
  adminActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  adminActionCard: {
    width: '48%',
    marginBottom: 12,
  },
  adminActionContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  adminActionTitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  adminActionDesc: {
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  alertCard: {
    backgroundColor: '#FFF3E0',
    marginBottom: 16,
  },
  alertTitle: {
    color: '#F57C00',
    marginBottom: 8,
  },
  alertButton: {
    marginTop: 12,
  },
  warningCard: {
    backgroundColor: '#FFF4E5',
    marginBottom: 16,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  warningTitle: {
    color: '#FF9500',
    marginBottom: 8,
    fontWeight: '700',
    fontSize: 17,
  },
  warningButton: {
    marginTop: 16,
    borderRadius: 12,
  },
  infoCard: {
    backgroundColor: '#E8F5FF',
    marginBottom: 16,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    marginTop: 8,
    color: '#1C1C1E',
    fontSize: 15,
    lineHeight: 22,
  },
  discoveryCard: {
    backgroundColor: '#E6F9ED',
    marginBottom: 16,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  chatPreviewCard: {
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatPreviewInfo: {
    marginLeft: 12,
    flex: 1,
  },
  chatPreviewMessage: {
    color: '#666',
    marginTop: 4,
  },
  chatPreviewMeta: {
    alignItems: 'flex-end',
  },
  chatPreviewTime: {
    color: '#999',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 14,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  volunteerInfoContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  volunteerInfoIcon: {
    marginBottom: 24,
  },
  volunteerInfoTitle: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  volunteerInfoText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  volunteerInfoButton: {
    marginBottom: 16,
    minWidth: 200,
  },
  userCard: {
    marginBottom: 8,
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  roleChipSmall: {
    height: 24,
  },
  userCardActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  promoteButton: {
    marginTop: 4,
  },
  chatCard: {
    marginBottom: 8,
  },
  chatLastMessage: {
    color: '#666',
    marginTop: 4,
  },
  chatMeta: {
    color: '#999',
    marginTop: 4,
    fontSize: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatAvatar: {
    backgroundColor: '#4CAF50',
  },
  chatMessages: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  chatMessagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  systemMessageContainer: {
    justifyContent: 'center',
  },
  messageAvatar: {
    marginHorizontal: 4,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 14,
    maxWidth: '75%',
    elevation: 0,
    marginBottom: 4,
  },
  myMessage: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 6,
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#E9E9EB',
    borderBottomLeftRadius: 6,
    alignSelf: 'flex-start',
  },
  systemMessage: {
    backgroundColor: '#FFF3E0',
    alignSelf: 'center',
    maxWidth: '90%',
    borderRadius: 16,
  },
  messageText: {
    color: '#1C1C1E',
    lineHeight: 22,
    fontSize: 16,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 6,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  myMessageTime: {
    color: '#E3F2FD',
  },
  chatInputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingBottom: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  messageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 26,
    marginHorizontal: 12,
  },
  imageButton: {
    marginRight: 4,
    marginBottom: 4,
  },
  messageInput: {
    flex: 1,
    maxHeight: 100,
    marginRight: 8,
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 4,
  },
  sendButton: {
    marginBottom: 4,
  },
  chatActionsRow: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  chatActionButton: {
    width: '100%',
  },
  signOutButton: {
    margin: 16,
    marginTop: 32,
  },
  button: {
    marginTop: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 4,
  },
  // Email Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailModalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  emailModalTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emailModalSubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  emailInput: {
    marginBottom: 12,
  },
  adminHint: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 18,
  },
  adminEmail: {
    fontWeight: 'bold',
    color: '#FF9800',
  },
  emailModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  emailModalButton: {
    flex: 1,
  },
  // Image Zoom Styles
  imageZoomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  imageZoomCloseArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageZoomHeader: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  imageZoomCloseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  imageZoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageZoomed: {
    width: width,
    height: width,
    maxWidth: '100%',
    maxHeight: '80%',
  },
  imageZoomHint: {
    color: '#FFF',
    position: 'absolute',
    bottom: 40,
    opacity: 0.7,
  },
  editProfileModal: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  editProfileContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  chipScroll: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
});

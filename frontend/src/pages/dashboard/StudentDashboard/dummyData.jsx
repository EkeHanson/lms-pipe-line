const dummyData = {
    student: {
      id: 'stu001',
      name: 'Alex Johnson',
      email: 'alex.johnson@student.edu',
      bio: 'Computer Science Major, Class of 2025',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      department: 'Computer Science',
      lastLogin: '2025-04-24T14:30:00Z',
      enrollmentDate: '2023-09-01',
      interests: ['AI', 'Web Development', 'Data Science'],
      learningTrack: 'Intermediate',
      points: 1250,
      badges: ['Quick Learner', 'Assignment Master'],
      language: 'en'
    },
    metrics: {
      enrolledCourses: 4,
      completedCourses: 2,
      assignmentsDue: 3,
      averageGrade: 86,
      learningHours: 42,
      strongestModule: 'Neural Networks',
      weakestModule: 'Graph Algorithms'
    },
    enrolledCourses: [
      {
        id: 1,
        title: 'Advanced Machine Learning',
        instructor: 'Dr. Sarah Johnson',
        category: 'AI',
        progress: 75,
        thumbnail: 'https://source.unsplash.com/random/300x200?machine+learning',
        nextLesson: '2025-04-25T14:00:00Z',
        assignmentsDue: 2,
        price: 99.99,
        rating: 4.5,
        lessons: [
          { id: 1, title: 'Introduction to ML', type: 'video', duration: '30min', completed: true },
          { id: 2, title: 'Neural Networks', type: 'video', duration: '45min', completed: false }
        ],
        bookmarked: true
      },
      {
        id: 2,
        title: 'Web Development Fundamentals',
        instructor: 'Prof. Michael Chen',
        category: 'Web',
        progress: 92,
        thumbnail: 'https://source.unsplash.com/random/300x200?web+development',
        nextLesson: '2025-04-26T10:00:00Z',
        assignmentsDue: 1,
        price: 79.99,
        rating: 4.8,
        lessons: [
          { id: 1, title: 'HTML Basics', type: 'video', duration: '20min', completed: true },
          { id: 2, title: 'CSS Flexbox', type: 'video', duration: '25min', completed: true }
        ],
        bookmarked: false
      },
      {
        id: 3,
        title: 'Data Structures & Algorithms',
        instructor: 'Dr. Emily Wilson',
        category: 'CS Core',
        progress: 60,
        thumbnail: 'https://source.unsplash.com/random/300x200?algorithm',
        nextLesson: '2025-04-27T09:00:00Z',
        assignmentsDue: 0,
        price: 89.99,
        rating: 4.2,
        lessons: [
          { id: 1, title: 'Arrays', type: 'video', duration: '15min', completed: true },
          { id: 2, title: 'Trees', type: 'video', duration: '40min', completed: false }
        ],
        bookmarked: true
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'Neural Networks Project',
        course: 'Advanced ML',
        dueDate: '2025-04-28T23:59:00Z',
        status: 'submitted',
        grade: 88,
        feedback: 'Excellent work on implementing the CNN architecture!',
        type: 'project'
      },
      {
        id: 2,
        title: 'React Portfolio',
        course: 'Web Dev',
        dueDate: '2025-05-05T23:59:00Z',
        status: 'in-progress',
        grade: null,
        feedback: null,
        type: 'assignment'
      },
      {
        id: 3,
        title: 'Sorting Algorithm Analysis',
        course: 'Data Structures',
        dueDate: '2025-05-10T23:59:00Z',
        status: 'not-started',
        grade: null,
        feedback: null,
        type: 'quiz'
      }
    ],
    messages: [
      {
        id: 1,
        sender: 'Dr. Sarah Johnson',
        course: 'Advanced ML',
        content: 'Feedback on your Neural Networks project',
        date: '2025-04-20T10:30:00Z',
        read: false,
        important: true
      },
      {
        id: 2,
        sender: 'System Notification',
        course: null,
        content: 'New grade posted for Web Dev assignment',
        date: '2025-04-19T16:15:00Z',
        read: true,
        important: false
      }
    ],
    activities: [
      {
        id: 1,
        action: 'Completed lesson: "Convolutional Networks"',
        date: '2025-04-20T09:00:00Z',
        course: 'Advanced ML',
        type: 'lesson'
      },
      {
        id: 2,
        action: 'Submitted "React Portfolio" assignment',
        date: '2025-04-19T14:00:00Z',
        course: 'Web Dev',
        type: 'assignment'
      }
    ],
    schedules: [
      {
        id: 1,
        title: 'ML Office Hours',
        date: '2025-04-25T14:00:00Z',
        duration: 60,
        platform: 'Zoom',
        link: 'https://zoom.us/j/123456789',
        description: 'Q&A session for upcoming project'
      },
      {
        id: 2,
        title: 'Web Dev Live Coding',
        date: '2025-04-26T10:00:00Z',
        duration: 90,
        platform: 'Google Meet',
        link: 'https://meet.google.com/abc-defg-hij',
        description: 'Building responsive layouts together'
      }
    ],
    grades: [
      { course: 'Advanced ML', assignment: 'Midterm Exam', grade: 92, average: 85 },
      { course: 'Web Dev', assignment: 'React Basics', grade: 84, average: 79 }
    ],
    feedbackHistory: [
      {
        id: 1,
        course: 'Database Systems',
        instructor: 'Prof. David Kim',
        date: '2025-03-15',
        rating: 4,
        comment: 'Great course content but assignments could be more clearly explained'
      }
    ],
    cart: [
      { id: 4, title: 'Cloud Computing Basics', price: 59.99, thumbnail: 'https://source.unsplash.com/random/300x200?cloud' }
    ],
    wishlist: [
      { id: 5, title: 'Cybersecurity Essentials', price: 69.99, thumbnail: 'https://source.unsplash.com/random/300x200?security' }
    ],
    paymentHistory: [
      { id: 1, course: 'Advanced ML', amount: 99.99, date: '2023-09-01', invoice: 'INV001' },
      { id: 2, course: 'Web Dev', amount: 79.99, date: '2023-10-15', invoice: 'INV002' }
    ],
    certificates: [
      { id: 1, course: 'Python Basics', date: '2024-12-01', code: 'CERT001' }
    ],
    gamification: {
      points: 1250,
      badges: ['Quick Learner', 'Assignment Master'],
      leaderboardRank: 15
    },
    analytics: {
      timeSpent: { total: '42h', weekly: '8h' },
      strengths: ['Neural Networks', 'HTML/CSS'],
      weaknesses: ['Graph Algorithms']
    }
  };
  
  export default dummyData;
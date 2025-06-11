
const dummyData = {
  instructor: {
    name: 'Dr. Sarah Johnson',
    email: 's.johnson@university.edu',
    bio: 'Professor of Computer Science with 10+ years experience in AI and Machine Learning',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    department: 'Computer Science',
    lastLogin: '2025-04-20T14:30:00Z'
  },
  metrics: {
    courses: 5,
    students: 128,
    pendingTasks: 12,
    completionRate: 82,
    upcomingEvents: 3
  },
  courses: [
    {
      id: 1,
      title: 'Advanced Machine Learning',
      category: 'AI',
      status: 'Published',
      students: 42,
      thumbnail: 'https://source.unsplash.com/random/300x200?machine+learning',
      lastUpdated: '2025-04-18',
      modules: [
        { id: 1, title: 'Week 1: Neural Networks', order: 1 },
        { id: 2, title: 'Week 2: Deep Learning', order: 2 }
      ],
      prerequisites: ['Data Structures'],
      versionHistory: [
        { version: '1.0', date: '2025-04-10', changes: 'Initial course setup' },
        { version: '1.1', date: '2025-04-18', changes: 'Added Week 2 content' }
      ]
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      category: 'Web',
      status: 'Published',
      students: 36,
      thumbnail: 'https://source.unsplash.com/random/300x200?web+development',
      lastUpdated: '2025-04-15',
      modules: [
        { id: 1, title: 'Week 1: HTML & CSS', order: 1 },
        { id: 2, title: 'Week 2: JavaScript', order: 2 }
      ],
      prerequisites: [],
      versionHistory: [
        { version: '1.0', date: '2025-04-05', changes: 'Initial course setup' }
      ]
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      category: 'CS Core',
      status: 'Published',
      students: 50,
      thumbnail: 'https://source.unsplash.com/random/300x200?algorithm',
      lastUpdated: '2025-04-10',
      modules: [
        { id: 1, title: 'Week 1: Arrays & Linked Lists', order: 1 },
        { id: 2, title: 'Week 2: Trees & Graphs', order: 2 }
      ],
      prerequisites: ['Programming 101'],
      versionHistory: [
        { version: '1.0', date: '2025-04-01', changes: 'Initial course setup' }
      ]
    }
  ],
  students: [
    {
      id: 1,
      name: 'Alice Chen',
      email: 'alice.chen@student.edu',
      progress: 88,
      lastActivity: '2025-04-20T09:15:00Z',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      course: 'Advanced ML',
      group: 'Group A'
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob.wilson@student.edu',
      progress: 65,
      lastActivity: '2025-04-19T14:30:00Z',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      course: 'Web Dev',
      group: 'Group B'
    },
    {
      id: 3,
      name: 'Carlos Ruiz',
      email: 'c.ruiz@student.edu',
      progress: 92,
      lastActivity: '2025-04-20T16:45:00Z',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      course: 'Data Structures',
      group: 'Group A'
    }
  ],
  assignments: [
    {
      id: 1,
      title: 'Neural Networks Project',
      course: 'Advanced ML',
      dueDate: '2025-04-28T23:59:00Z',
      submissions: 28,
      graded: 15,
      averageScore: 82,
      rubric: [
        { criterion: 'Code Quality', weight: 40 },
        { criterion: 'Functionality', weight: 60 }
      ]
    },
    {
      id: 2,
      title: 'React Portfolio',
      course: 'Web Dev',
      dueDate: '2025-05-05T23:59:00Z',
      submissions: 12,
      graded: 5,
      averageScore: 76,
      rubric: [
        { criterion: 'Design', weight: 30 },
        { criterion: 'Functionality', weight: 70 }
      ]
    }
  ],
  quizzes: [
    {
      id: 1,
      title: 'ML Basics Quiz',
      course: 'Advanced ML',
      questions: 10,
      timeLimit: 30,
      attemptsAllowed: 2,
      status: 'Published',
      averageScore: 85,
      created: '2025-04-10'
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      course: 'Web Dev',
      questions: 15,
      timeLimit: 45,
      attemptsAllowed: 1,
      status: 'Draft',
      averageScore: 0,
      created: '2025-04-12'
    }
  ],
  messages: [
    {
      id: 1,
      sender: 'Alice Chen',
      course: 'Advanced ML',
      content: 'Question about the backpropagation assignment',
      date: '2025-04-20T10:30:00Z',
      read: false,
      urgent: true
    },
    {
      id: 2,
      sender: 'Teaching Assistant',
      course: 'Web Dev',
      content: 'Reminder: Office hours moved to Thursday',
      date: '2025-04-19T16:15:00Z',
      read: true,
      urgent: false
    }
  ],
  activities: [
    {
      id: 1,
      action: 'Posted new lecture: "Convolutional Networks"',
      date: '2025-04-20T09:00:00Z',
      course: 'Advanced ML',
      type: 'lecture'
    },
    {
      id: 2,
      action: 'Graded assignments for Web Dev class',
      date: '2025-04-19T14:00:00Z',
      course: 'Web Dev',
      type: 'grading'
    },
    {
      id: 3,
      action: 'Updated syllabus for Data Structures',
      date: '2025-04-18T11:30:00Z',
      course: 'Data Structures',
      type: 'update'
    }
  ],
  schedules: [
    {
      id: 1,
      title: 'ML Office Hours',
      date: '2025-04-22T14:00:00Z',
      duration: 60,
      platform: 'Zoom',
      link: 'https://zoom.us/j/123456789',
      description: 'Q&A session for upcoming project',
      bookings: [
        { student: 'Alice Chen', time: '14:00-14:15' },
        { student: 'Carlos Ruiz', time: '14:15-14:30' }
      ]
    },
    {
      id: 2,
      title: 'Department Meeting',
      date: '2025-04-24T10:00:00Z',
      duration: 90,
      platform: 'Campus',
      location: 'CS Building Room 305',
      description: 'Curriculum planning for next semester',
      bookings: []
    }
  ],
  materials: [
    {
      id: 1,
      title: 'Lecture 5 Slides',
      type: 'slides',
      course: 'Advanced ML',
      date: '2025-04-15',
      downloads: 42,
      url: ''
    },
    {
      id: 2,
      title: 'Assignment 3 Template',
      type: 'document',
      course: 'Web Dev',
      date: '2025-04-10',
      downloads: 36,
      url: ''
    },
    {
      id: 3,
      title: 'Algorithm Visualizations',
      type: 'video',
      course: 'Data Structures',
      date: '2025-04-05',
      downloads: 28,
      url: 'https://youtube.com/watch?v=example'
    }
  ],
  feedbackHistory: [
    {
      id: 1,
      course: 'Advanced Machine Learning',
      student: 'Alice Chen',
      date: '2025-04-15',
      rating: 4.5,
      comment: 'The course content is excellent, but more practical examples would help.',
      anonymous: false
    },
    {
      id: 2,
      course: 'Web Development Fundamentals',
      student: 'Anonymous',
      date: '2025-04-10',
      rating: 3.5,
      comment: 'Assignments are challenging but could use clearer instructions.',
      anonymous: true
    }
  ],
  forums: [
    {
      id: 1,
      course: 'Advanced ML',
      title: 'Neural Networks Discussion',
      posts: 25,
      lastActivity: '2025-04-20T12:00:00Z',
      pinned: true
    },
    {
      id: 2,
      course: 'Web Dev',
      title: 'React Best Practices',
      posts: 15,
      lastActivity: '2025-04-19T15:30:00Z',
      pinned: false
    }
  ],
  analytics: {
    engagement: [
      {
        course: 'Advanced ML',
        averageTimeSpent: 120,
        quizAttempts: 45,
        dropoutRate: 5
      },
      {
        course: 'Web Dev',
        averageTimeSpent: 90,
        quizAttempts: 30,
        dropoutRate: 8
      }
    ],
    completions: [
      {
        course: 'Advanced ML',
        completed: 35,
        total: 42,
        certificateIssued: 30
      },
      {
        course: 'Web Dev',
        completed: 25,
        total: 36,
        certificateIssued: 20
      }
    ]
  },
  certifications: [
    {
      id: 1,
      student: 'Alice Chen',
      course: 'Advanced ML',
      issued: '2025-04-18',
      template: 'Standard Certificate'
    },
    {
      id: 2,
      student: 'Carlos Ruiz',
      course: 'Data Structures',
      issued: '2025-04-15',
      template: 'Standard Certificate'
    }
  ],
  attendance: [
    {
      id: 1,
      course: 'Advanced ML',
      date: '2025-04-20',
      studentsPresent: ['Alice Chen', 'Carlos Ruiz'],
      totalStudents: 42
    },
    {
      id: 2,
      course: 'Web Dev',
      date: '2025-04-19',
      studentsPresent: ['Bob Wilson'],
      totalStudents: 36
    }
  ],
  compliance: {
    gdprConsent: true,
    recordingsConsent: false
  }
};

export default dummyData;

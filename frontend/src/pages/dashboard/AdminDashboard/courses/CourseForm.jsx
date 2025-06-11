import { coursesAPI, userAPI } from '../../../../config';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ModuleForm, DraggableModule } from './ModuleForm';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Paper, Divider,
  FormControl, InputLabel, Select, MenuItem, Chip, useTheme,
  IconButton, List, ListItem, ListItemText, ListItemSecondaryAction,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  ListItemIcon, Checkbox, FormControlLabel, Tab, Tabs, Avatar,
  useMediaQuery, AppBar, Toolbar, Drawer, ListItemAvatar, Tooltip,
  CircularProgress, Alert, 
} from '@mui/material';
import {
  Save, Cancel, CloudUpload, AddCircle, Delete,
  Link as LinkIcon, PictureAsPdf, VideoLibrary,
  InsertDriveFile, Edit, Person, People, School,
  Menu as MenuIcon, ArrowBack, Add, Star 
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import LearningPaths from './LearningPaths';
import SCORMxAPISettings from './SCORMxAPISettings';
import CertificateSettings from './CertificateSettings';
import GamificationManager from './GamificationManager';
import InstructorAssignmentDialog from './InstructorAssignmentDialog';

const resourceTypes = [
  { value: 'link', label: 'Web Link', icon: <LinkIcon /> },
  { value: 'pdf', label: 'PDF Document', icon: <PictureAsPdf /> },
  { value: 'video', label: 'Video', icon: <VideoLibrary /> },
  { value: 'file', label: 'File', icon: <InsertDriveFile /> }
];

const CourseForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [course, setCourse] = useState({
    title: '',
    code: '',
    description: '',
    category_id: '',
    level: 'Beginner',
    status: 'Draft',
    duration: '',
    price: 0,
    discountPrice: null,
    currency: 'NGN',
    learningOutcomes: [],
    prerequisites: [],
    thumbnail: null,
    modules: [],
    resources: [],
    instructors: [],
    learningPaths: [],
    certificateSettings: {
      enabled: false,
      template: 'default',
      customText: '',
      signature: null,
      signatureName: '',
      showDate: true,
      showCourseName: true,
      showCompletionHours: true,
      customLogo: null
    },
    scormSettings: {
      enabled: false,
      standard: 'scorm12',
      version: '1.2',
      completionThreshold: 80,
      scoreThreshold: 70,
      tracking: {
        completion: true,
        score: true,
        time: true,
        progress: true
      },
      package: null,
      packageName: ''
    }
  });

  const [categories, setCategories] = useState([]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [newOutcome, setNewOutcome] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [instructorDialogOpen, setInstructorDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState({
    id: null,
    title: '',
    type: 'link',
    url: '',
    file: null
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const response = await coursesAPI.getCategories();
        setCategories(response.data.results || response.data);
      } catch (error) {
        setApiError('Failed to load categories');
      } finally {
        setCategoryLoading(false);
      }
    };
  
    const fetchCourseData = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const response = await coursesAPI.getCourse(id);
        const courseData = response.data;
        setCourse({
          ...course,
          title: courseData.title || '',
          code: courseData.code || '',
          description: courseData.description || '',
          category_id: courseData.category?.id || courseData.category_id || '',
          level: courseData.level || 'Beginner',
          status: courseData.status || 'Draft',
          duration: courseData.duration || '',
          price: courseData.price || 0,
          discountPrice: courseData.discount_price || null,
          currency: courseData.currency || 'NGN',
          learningOutcomes: Array.isArray(courseData.learning_outcomes) ? courseData.learning_outcomes : [],
          prerequisites: Array.isArray(courseData.prerequisites) ? courseData.prerequisites : [],
          thumbnail: null,
          modules: courseData.modules || [],
          resources: courseData.resources || [], // Ensure resources are loaded
          instructors: courseData.instructors || []
        });
      } catch (error) {
        setApiError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategories();
    fetchCourseData();
  }, [id, isEdit]);

  const toggleModuleSelection = (moduleId) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const moveModule = (dragIndex, hoverIndex) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      const draggedModule = newModules[dragIndex];
      
      newModules.splice(dragIndex, 1);
      newModules.splice(hoverIndex, 0, draggedModule);
      
      const updatedModules = newModules.map((module, idx) => ({
        ...module,
        order: idx
      }));
      
      return {
        ...prev,
        modules: updatedModules
      };
    });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (isMobile) setMobileOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setCourse(prev => ({ ...prev, price: value }));
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value === '' ? null : parseFloat(e.target.value);
    setCourse(prev => ({ ...prev, discountPrice: value }));
  };

  const addLearningOutcome = () => {
    if (newOutcome.trim()) {
      setCourse(prev => ({
        ...prev,
        learningOutcomes: [...prev.learningOutcomes, newOutcome.trim()]
      }));
      setNewOutcome('');
    }
  };

  const removeLearningOutcome = (index) => {
    setCourse(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setCourse(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index) => {
    setCourse(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const openResourceDialog = (resource = null) => {
    setCurrentResource(resource || {
      id: null,
      title: '',
      type: 'link',
      url: '',
      file: null
    });
    setResourceDialogOpen(true);
  };

  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setCurrentResource(prev => ({ ...prev, [name]: value }));
  };
  
  const handleResourceFileChange = (e) => {
    setCurrentResource(prev => ({ ...prev, file: e.target.files[0] }));
  };

const saveResource = async () => {
  if (!currentResource.title.trim()) {
    setApiError('Resource title is required');
    return;
  }
  if (currentResource.type === 'link' && !currentResource.url.trim()) {
    setApiError('URL is required for web link resources');
    return;
  }
  if (['pdf', 'video', 'file'].includes(currentResource.type) && !currentResource.file && !currentResource.id) {
    setApiError('File is required for this resource type');
    return;
  }

  setLoading(true);
  setApiError('');

  try {
    const formData = new FormData();
    formData.append('title', currentResource.title);
    formData.append('resource_type', currentResource.type);
    if (currentResource.type === 'link') {
      formData.append('url', currentResource.url || '');
    } else if (currentResource.file) {
      formData.append('file', currentResource.file);
    }
    formData.append('order', course.resources.length);

    let updatedResource;
    if (currentResource.id && !isNaN(currentResource.id)) {
      // Update existing resource
      const response = await coursesAPI.updateResource(id, currentResource.id, formData);
      updatedResource = response.data;
      setCourse(prev => ({
        ...prev,
        resources: prev.resources.map(r => (r.id === currentResource.id ? updatedResource : r)),
      }));
    } else {
      // Create new resource
      const response = await coursesAPI.createResource(id, formData);
      updatedResource = response.data;
      setCourse(prev => ({
        ...prev,
        resources: [...prev.resources, updatedResource],
      }));
    }

    setResourceDialogOpen(false);
    setCurrentResource({
      id: null,
      title: '',
      type: 'link',
      url: '',
      file: null,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  } catch (error) {
    setApiError(error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Failed to save resource');
  } finally {
    setLoading(false);
  }
};

const deleteResource = async (id) => {
  setLoading(true);
  setApiError('');

  try {
    await coursesAPI.deleteResource(course.id || id, id);
    setCourse(prev => ({
      ...prev,
      resources: prev.resources.filter(r => r.id !== id),
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  } catch (error) {
    setApiError(error.response?.data?.detail || 'Failed to delete resource');
  } finally {
    setLoading(false);
  }
};

  const addModule = async () => {
    try {
      setLoading(true);

      if (!isEdit) {
        const courseResponse = await coursesAPI.createCourse({
          title: course.title || 'New Course',
          code: course.code || `TEMP-${Date.now()}`,
          description: course.description || '',
          category_id: course.category_id || categories[0]?.id,
          level: course.level,
          status: 'Draft',
        });

        setCourse(prev => ({ ...prev, id: courseResponse.data.id }));
        navigate(`/admin/courses/${courseResponse.data.id}/edit`, { replace: true });
      }

      const courseId = id || course.id;
      if (!courseId) {
        throw new Error('Course ID is not available');
      }

      const response = await coursesAPI.createModule(courseId, {
        course: courseId,
        title: 'New Module',
        description: '',
        order: course.modules.length,
        is_published: false
      });

      setCourse(prev => ({
        ...prev,
        modules: [...prev.modules, {
          ...response.data,
          lessons: []
        }]
      }));
    } catch (error) {
      console.error('Error creating module:', error);
      setApiError(error.response?.data?.detail || error.message || 'Failed to create module');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleChange = (moduleId, updatedModule) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === moduleId ? updatedModule : m)
    }));
  };

  const deleteModule = async (moduleId) => {
    try {
      setLoading(true);
      
      if (!isNaN(moduleId)) {
        await coursesAPI.deleteModule(moduleId);
      }
      
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.filter(m => m.id !== moduleId),
        instructors: prev.instructors.map(instructor => {
          if (instructor.assignedModules !== 'all') {
            return {
              ...instructor,
              assignedModules: instructor.assignedModules.filter(id => id !== moduleId)
            };
          }
          return instructor;
        })
      }));
    } catch (error) {
      console.error('Error deleting module:', error);
      setApiError('Failed to delete module');
    } finally {
      setLoading(false);
    }
  };

  const handleInstructorAssignment = (instructor, assignedModules) => {
    const existingIndex = course.instructors.findIndex(i => i.instructorId === instructor.id);
    
    const newInstructor = {
      instructorId: instructor.id,
      name: instructor.name,
      email: instructor.email,
      isActive: true,
      assignedModules: assignedModules
    };

    if (existingIndex >= 0) {
      const updatedInstructors = [...course.instructors];
      updatedInstructors[existingIndex] = newInstructor;
      setCourse(prev => ({ ...prev, instructors: updatedInstructors }));
    } else {
      setCourse(prev => ({
        ...prev,
        instructors: [...prev.instructors, newInstructor]
      }));
    }
  };

  const toggleInstructorStatus = (instructorId) => {
    setCourse(prev => ({
      ...prev,
      instructors: prev.instructors.map(instructor => 
        instructor.instructorId === instructorId 
          ? { ...instructor, isActive: !instructor.isActive }
          : instructor
      )
    }));
  };

  const removeInstructor = (instructorId) => {
    setCourse(prev => ({
      ...prev,
      instructors: prev.instructors.filter(i => i.instructorId !== instructorId)
    }));
  };

  const getAssignedModulesText = (instructor) => {
    if (instructor.assignedModules === 'all') return 'Entire course';
    if (instructor.assignedModules.length === 0) return 'No modules assigned';
    if (instructor.assignedModules.length === 1) {
      const module = course.modules.find(m => m.id === instructor.assignedModules[0]);
      return module ? module.title : '1 module';
    }
    return `${instructor.assignedModules.length} modules`;
  };

  const handleCategoryDialogOpen = (category = null) => {
    setEditingCategory(category);
    setNewCategory(category ? { name: category.name, description: category.description } : { name: '', description: '' });
    setCategoryDialogOpen(true);
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const saveCategory = async () => {
    if (!newCategory.name.trim()) {
      setErrors({ categoryName: 'Category name is required' });
      return;
    }

    setCategoryLoading(true);
    setErrors({});
    try {
      const payload = {
        name: newCategory.name.trim(),
        description: newCategory.description.trim() || ''
      };

      if (editingCategory) {
        const response = await coursesAPI.updateCategory(editingCategory.id, payload);
        setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? response.data : cat));
        setApiError('');
      } else {
        const response = await coursesAPI.createCategory(payload);
        setCategories(prev => [...prev, response.data]);
        setApiError('');
      }
      setCategoryDialogOpen(false);
      setNewCategory({ name: '', description: '' });
      setEditingCategory(null);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.name?.[0] || 
                          'Failed to save category';
      setApiError(errorMessage);
    } finally {
      setCategoryLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setCategoryLoading(true);
    try {
      await coursesAPI.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setApiError('');
    } catch (error) {
      setApiError(error.response?.data?.detail || 'Failed to delete category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleNext = () => {
    if (activeTab < tabLabels.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrevious = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    if (!course.title.trim()) newErrors.title = 'Title is required';
    if (!course.code.trim()) newErrors.code = 'Course code is required';
    if (!course.description.trim()) newErrors.description = 'Description is required';
    if (!course.category_id) newErrors.category = 'Category is required';
  
    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors:", newErrors);
      setErrors(newErrors);
      return;
    }
  
    setLoading(true);
    setApiError('');
  
    try {
      const formData = new FormData();
  
      formData.append('title', course.title);
      formData.append('code', course.code);
      formData.append('description', course.description);
      formData.append('category_id', course.category_id);
      formData.append('level', course.level);
      formData.append('status', course.status);
      formData.append('duration', course.duration);
      formData.append('price', course.price);
  
      if (course.discountPrice) formData.append('discount_price', course.discountPrice);
      formData.append('currency', course.currency || 'NGN');
  
      course.learningOutcomes.forEach(outcome => {
        formData.append('learning_outcomes', outcome);
      });
      course.prerequisites.forEach(prereq => {
        formData.append('prerequisites', prereq);
      });
  
      if (course.thumbnail instanceof File) {
        formData.append('thumbnail', course.thumbnail);
      }
  
      let response;
      if (isEdit) {
        response = await coursesAPI.updateCourse(id, formData);
      } else {
        response = await coursesAPI.createCourse(formData);
        navigate(`/admin/courses/edit/${response.data.id}`, { replace: true });
      }
  
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
  
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
  
      if (isEdit) {
        setCourse(prev => ({
          ...prev,
          title: response.data.title || prev.title,
          code: response.data.code || prev.code,
          description: response.data.description || prev.description,
          category_id: response.data.category_id || prev.category_id,
          level: response.data.level || prev.level,
          status: response.data.status || prev.status,
          duration: response.data.duration || prev.duration,
          price: response.data.price || prev.price,
          discountPrice: response.data.discount_price || prev.discountPrice,
          currency: response.data.currency || prev.currency,
          learningOutcomes: prev.learningOutcomes,
          prerequisites: prev.prerequisites,
          modules: prev.modules,
          resources: prev.resources,
          instructors: prev.instructors,
          thumbnail: prev.thumbnail
        }));
      }
    } catch (error) {
      console.error("Save error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail || 
                          error.message || 
                          'Failed to save course';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
    if (!course.title.trim()) newErrors.title = 'Title is required';
    if (!course.code.trim()) newErrors.code = 'Course code is required';
    if (!course.description.trim()) newErrors.description = 'Description is required';
    if (!course.category_id) newErrors.category = 'Category is required';
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setLoading(true);
    setApiError('');
  
    try {
      const formData = new FormData();
      formData.append('title', course.title);
      formData.append('code', course.code);
      formData.append('description', course.description);
      formData.append('category_id', course.category_id);
      formData.append('level', course.level);
      formData.append('status', course.status);
      formData.append('duration', course.duration);
      formData.append('price', course.price);
      if (course.discountPrice) formData.append('discount_price', course.discountPrice);
      formData.append('currency', course.currency || 'NGN');
  
      course.learningOutcomes.forEach(outcome => {
        formData.append('learning_outcomes', outcome);
      });
      course.prerequisites.forEach(prereq => {
        formData.append('prerequisites', prereq);
      });
  
      if (course.thumbnail instanceof File) {
        formData.append('thumbnail', course.thumbnail);
      }
  
      if (isEdit) {
        await coursesAPI.updateCourse(id, formData);
      } else {
        await coursesAPI.createCourse(formData);
      }
      navigate('/admin/courses');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.detail || 
                          error.message || 
                          'Failed to save course';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type) => {
    const resourceType = resourceTypes.find(t => t.value === type);
    return resourceType ? resourceType.icon : <InsertDriveFile />;
  };

  const tabLabels = [
    { label: 'Details', icon: <Edit fontSize="small" /> },
    { label: 'Modules', icon: <School fontSize="small" /> },
    { label: 'Instructors', icon: <People fontSize="small" /> },
    { label: 'Resources', icon: <InsertDriveFile fontSize="small" /> },
    { label: 'Paths', icon: <LinkIcon fontSize="small" /> },
    { label: 'Certificates', icon: <PictureAsPdf fontSize="small" /> },
    { label: 'SCORM', icon: <VideoLibrary fontSize="small" /> },
    { label: 'Gamification', icon: <Star fontSize="small" /> },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {isEdit ? 'Edit Course' : 'Create Course'}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box sx={{ display: 'flex', flexGrow: 1, pt: isMobile ? '56px' : 0 }}>
        {isMobile && mobileOpen && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': { 
                width: 240,
                boxSizing: 'border-box',
                pt: isMobile ? '56px' : 0
              },
            }}
          >
            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={handleTabChange}
              sx={{ flexGrow: 1 }}
            >
              {tabLabels.map((tab, index) => (
                <Tab 
                  key={index}
                  icon={tab.icon}
                  iconPosition="start"
                  label={tab.label}
                  sx={{
                    minHeight: 'auto',
                    py: 1.5,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    px: 2,
                    gap: 1,
                    '& .MuiTab-iconWrapper': {
                      marginRight: '8px'
                    }
                  }}
                />
              ))}
            </Tabs>
          </Drawer>
        )}

        {!isMobile && (
          <Tabs
            orientation="vertical"
            value={activeTab}
            onChange={handleTabChange}
            sx={{ 
              borderRight: 1,
              borderColor: 'divider',
              minWidth: 160,
              maxWidth: 220,
              '& .MuiTab-root': {
                minHeight: 48,
                alignItems: 'flex-start',
                textAlign: 'left',
                px: 2,
                gap: 1,
                '& .MuiTab-iconWrapper': {
                  marginRight: '8px'
                }
              }
            }}
          >
            {tabLabels.map((tab, index) => (
              <Tab 
                key={index}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
              />
            ))}
          </Tabs>
        )}

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: isMobile ? 1 : 3,
            overflow: 'auto',
            maxHeight: isMobile ? 'calc(100vh - 56px)' : '100vh'
          }}
        >
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError('')}>
              {apiError}
            </Alert>
          )}

          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaveSuccess(false)}>
              Course saved successfully!
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            {isMobile && (
              <IconButton onClick={() => navigate('/admin/courses')} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
            )}
            <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 600, display: 'inline' }}>
              {isEdit ? 'Edit Course' : 'Create New Course'}
            </Typography>
          </Box>

          <Paper sx={{ p: isMobile ? 1 : 3, mb: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                {activeTab === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        label="Course Title"
                        name="title"
                        value={course.title}
                        onChange={handleChange}
                        error={!!errors.title}
                        helperText={errors.title}
                        sx={{ mb: 2 }}
                        size={isMobile ? 'small' : 'medium'}
                      />
                      
                      <TextField
                        fullWidth
                        label="Course Code"
                        name="code"
                        value={course.code}
                        onChange={handleChange}
                        error={!!errors.code}
                        helperText={errors.code}
                        sx={{ mb: 2 }}
                        size={isMobile ? 'small' : 'medium'}
                      />
                      
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description}
                        multiline
                        rows={isMobile ? 3 : 4}
                        sx={{ mb: 2 }}
                        size={isMobile ? 'small' : 'medium'}
                      />

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Learning Outcomes
                      </Typography>

                      <Box sx={{ mb: 1 }}>
                        {course.learningOutcomes.map((outcome, index) => (
                          <Chip
                            key={index}
                            label={outcome}
                            onDelete={() => removeLearningOutcome(index)}
                            sx={{ m: 0.5 }}
                            size={isMobile ? 'small' : 'medium'}
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size={isMobile ? 'small' : 'medium'}
                          placeholder="What will students learn?"
                          value={newOutcome}
                          onChange={(e) => setNewOutcome(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addLearningOutcome()}
                        />
                        <Button 
                          variant="outlined" 
                          onClick={addLearningOutcome}
                          disabled={!newOutcome.trim()}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          Add
                        </Button>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Prerequisites
                      </Typography>

                      <Box sx={{ mb: 1 }}>
                        {course.prerequisites.map((prereq, index) => (
                          <Chip
                            key={index}
                            label={prereq}
                            onDelete={() => removePrerequisite(index)}
                            sx={{ m: 0.5 }}
                            size={isMobile ? 'small' : 'medium'}
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size={isMobile ? 'small' : 'medium'}
                          placeholder="What should students know beforehand?"
                          value={newPrerequisite}
                          onChange={(e) => setNewPrerequisite(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
                        />
                        <Button 
                          variant="outlined" 
                          onClick={addPrerequisite}
                          disabled={!newPrerequisite.trim()}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          Add
                        </Button>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FormControl fullWidth sx={{ flexGrow: 1 }} size={isMobile ? 'small' : 'medium'}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          name="category_id"
                          value={course.category_id || ''}
                          onChange={handleChange}
                          label="Category"
                          error={!!errors.category}
                        >
                          {categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                          ))}
                        </Select>
                        {errors.category && (
                          <Typography variant="caption" color="error">
                            {errors.category}
                          </Typography>
                        )}
                      </FormControl>
                        <IconButton onClick={() => handleCategoryDialogOpen()} sx={{ ml: 1 }}>
                          <Add />
                        </IconButton>
                      </Box>

                      {categoryLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      )}

                      <List dense>
                        {categories.map(category => (
                          <ListItem key={category.id} divider>
                            <ListItemText primary={category.name} />
                            <ListItemSecondaryAction>
                              <IconButton onClick={() => handleCategoryDialogOpen(category)}>
                                <Edit />
                              </IconButton>
                              <IconButton onClick={() => deleteCategory(category.id)}>
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>

                      <FormControl fullWidth sx={{ mb: 2 }} size={isMobile ? 'small' : 'medium'}>
                        <InputLabel>Level</InputLabel>
                        <Select
                          name="level"
                          value={course.level}
                          onChange={handleChange}
                          label="Level"
                        >
                          <MenuItem value="Beginner">Beginner</MenuItem>
                          <MenuItem value="Intermediate">Intermediate</MenuItem>
                          <MenuItem value="Advanced">Advanced</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 2 }} size={isMobile ? 'small' : 'medium'}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={course.status}
                          onChange={handleChange}
                          label="Status"
                        >
                          <MenuItem value="Draft">Draft</MenuItem>
                          <MenuItem value="Published">Published</MenuItem>
                          <MenuItem value="Archived">Archived</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Duration"
                        name="duration"
                        value={course.duration}
                        onChange={handleChange}
                        placeholder="e.g. 8 weeks, 30 hours"
                        sx={{ mb: 2 }}
                        size={isMobile ? 'small' : 'medium'}
                      />

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                        Pricing
                      </Typography>

                      <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={course.price}
                        onChange={handlePriceChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {course.currency}
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                        size={isMobile ? 'small' : 'medium'}
                      />

                      <TextField
                        fullWidth
                        label="Discount Price (optional)"
                        type="number"
                        value={course.discountPrice || ''}
                        onChange={handleDiscountChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {course.currency}
                            </InputAdornment>
                          ),
                        }}
                        size={isMobile ? 'small' : 'medium'}
                      />

                      <Divider sx={{ my: 2 }} />

                      <Button
                        fullWidth
                        variant="contained"
                        component="label"
                        startIcon={<CloudUpload />}
                        sx={{ mb: 2 }}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        Upload Thumbnail
                        <input
                          type="file"
                          hidden
                          onChange={(e) => setCourse(prev => ({ ...prev, thumbnail: e.target.files[0] }))}
                          accept="image/*"
                        />
                      </Button>

                      {course.thumbnail && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {course.thumbnail.name || 'Thumbnail selected'}
                          </Typography>
                          <IconButton onClick={() => setCourse(prev => ({ ...prev, thumbnail: null }))} size="small">
                            <Delete fontSize="small" /> 
                          </IconButton>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                )}

                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Course Modules
                    </Typography>

                    {course.modules.length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <School sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No modules added yet
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                          Add modules to structure your course content
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddCircle />}
                          onClick={addModule}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          Add First Module
                        </Button>
                      </Box>
                    )}
                    {selectedModules.length > 0 && (
                      <Paper sx={{ 
                        p: 1, 
                        mb: 2, 
                        display: 'flex', 
                        gap: 1,
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <Typography sx={{ flexGrow: 1 }}>
                          {selectedModules.length} selected
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => togglePublishSelectedModules(true)}
                          size="small"
                          disabled={loading}
                        >
                          Publish
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => togglePublishSelectedModules(false)}
                          size="small"
                          disabled={loading}
                        >
                          Unpublish
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={duplicateSelectedModules}
                          size="small"
                          disabled={loading}
                        >
                          Duplicate
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={deleteSelectedModules}
                          size="small"
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </Paper>
                    )}

                    <DndProvider backend={HTML5Backend}>
                      {course.modules.map((module, index) => (
                        <DraggableModule
                          key={module.id}
                          index={index}
                          module={module}
                          moveModule={moveModule}
                          selectedModules={selectedModules}
                          toggleModuleSelection={toggleModuleSelection}
                          onChange={handleModuleChange}
                          onDelete={deleteModule}
                          isMobile={isMobile}
                          courseId={id}
                        />
                      ))}
                    </DndProvider>

                    {course.modules.length > 0 && (
                      <Button
                        startIcon={<AddCircle />}
                        onClick={addModule}
                        sx={{ mt: 2 }}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        Add Another Module
                      </Button>
                    )}
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Course Instructors
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<People />}
                        onClick={() => setInstructorDialogOpen(true)}
                        size={isMobile ? 'small' : 'medium'}
                      >
                        Assign Instructor
                      </Button>
                    </Box>

                    {course.instructors.length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Person sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No instructors assigned
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                          Assign instructors to teach this course
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<People />}
                          onClick={() => setInstructorDialogOpen(true)}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          Assign Instructor
                        </Button>
                      </Box>
                    )}

                    <List dense={isMobile}>
                      {course.instructors.map((instructor) => (
                        <ListItem
                          key={instructor.instructorId}
                          divider
                          sx={{
                            pr: { xs: 12, sm: 16 }, // Increased padding-right for actions
                            alignItems: 'flex-start', // Align items to top for better text wrapping
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {instructor.name.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={instructor.name}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {instructor.email}
                                </Typography>
                                {` • Assigned to: ${getAssignedModulesText(instructor)}`}
                              </>
                            }
                            primaryTypographyProps={{ variant: isMobile ? 'body2' : 'body1' }}
                            secondaryTypographyProps={{ variant: isMobile ? 'caption' : 'body2' }}
                            sx={{
                              mr: { xs: 2, sm: 4 }, // Margin-right to avoid overlap with actions
                              maxWidth: { xs: '60%', sm: '70%' }, // Limit text width
                              wordBreak: 'break-word', // Ensure long text wraps
                            }}
                          />
                          <ListItemSecondaryAction
                            sx={{
                              right: { xs: 8, sm: 16 }, // Adjust right positioning
                              top: '50%', // Center vertically
                              transform: 'translateY(-50%)', // Adjust for vertical centering
                              display: 'flex', // Align actions in a row
                              alignItems: 'center',
                              gap: { xs: 0.5, sm: 1 }, // Space between action items
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={instructor.isActive}
                                  onChange={() => toggleInstructorStatus(instructor.instructorId)}
                                  size={isMobile ? 'small' : 'medium'}
                                  sx={{
                                    p: 0, // Remove default padding to control spacing
                                    mr: { xs: 0.5, sm: 1 }, // Add margin-right to separate from label
                                  }}
                                />
                              }
                              label={isMobile ? '' : ''} // Hide label on mobile
                              labelPlacement="end" // Place label after checkbox
                              sx={{
                                mr: { xs: 0.5, sm: 1 }, // Margin-right to separate from buttons
                                minWidth: 0, // Prevent label from taking too much space
                                '& .MuiFormControlLabel-label': {
                                  fontSize: isMobile ? '0.75rem' : '0.875rem', // Adjust label font size
                                },
                              }}
                            />
                            <Tooltip title="Edit Instructor">
                              <IconButton
                                onClick={() => {
                                  const instructorData = course.instructors.find(
                                    (i) => i.instructorId === instructor.instructorId
                                  );
                                  setCurrentResource({
                                    ...instructorData,
                                    assignedModules: instructorData.assignedModules,
                                  });
                                  setInstructorDialogOpen(true);
                                }}
                                size={isMobile ? 'small' : 'medium'}
                              >
                                <Edit fontSize={isMobile ? 'small' : 'medium'} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove Instructor">
                              <IconButton
                                onClick={() => removeInstructor(instructor.instructorId)}
                                size={isMobile ? 'small' : 'medium'}
                              >
                                <Delete fontSize={isMobile ? 'small' : 'medium'} />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {activeTab === 3 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Course Resources
                    </Typography>

                    <List dense={isMobile}>
                      {course.resources.map((resource) => (
                        <ListItem key={resource.id}>
                          <ListItemIcon>
                            {getResourceIcon(resource.type)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={resource.title}
                            secondary={resource.type === 'link' ? resource.url : resource.file?.name || resource.file}
                            primaryTypographyProps={{ variant: isMobile ? 'body2' : 'body1' }}
                            secondaryTypographyProps={{ variant: isMobile ? 'caption' : 'body2' }}
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              onClick={() => openResourceDialog(resource)}
                              size={isMobile ? 'small' : 'medium'}
                            >
                              <Edit fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                            <IconButton 
                              onClick={() => deleteResource(resource.id)}
                              size={isMobile ? 'small' : 'medium'}
                            >
                              <Delete fontSize={isMobile ? 'small' : 'medium'} />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      variant="outlined"
                      startIcon={<AddCircle />}
                      onClick={() => openResourceDialog()}
                      sx={{ mt: 1 }}
                      size={isMobile ? 'small' : 'medium'}
                    >
                      Add Resource
                    </Button>
                  </Box>
                )}

                {activeTab === 4 && <LearningPaths courseId={id} isMobile={isMobile} />}
                {activeTab === 5 && <CertificateSettings courseId={id} isMobile={isMobile} />}
                {activeTab === 6 && <SCORMxAPISettings courseId={id} isMobile={isMobile} />}
                {activeTab === 7 && <GamificationManager courseId={id} isMobile={isMobile} />}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  gap: { xs: 2, sm: 1 }, // Increased gap on mobile
                  mt: 2
                }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons vertically on mobile
                    gap: { xs: 1, sm: 1 }, // Consistent gap
                    flex: { xs: 1, sm: 'auto' }, // Full width on mobile
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'space-between', sm: 'flex-start' }
                  }}>
                    <Button
                      fullWidth={isMobile}
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={handlePrevious}
                      disabled={activeTab === 0}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ 
                        mb: { xs: 1, sm: 0 }, // Margin bottom on mobile
                        minWidth: { sm: 120 }, // Ensure consistent width on desktop
                        flex: { xs: 1, sm: 'none' } // Equal width on mobile
                      }}
                    >
                      {isMobile ? 'Previous' : 'Previous'} {/* Show text on mobile */}
                    </Button>

                    <Button
                      fullWidth={isMobile}
                      onClick={handleSave}
                      variant="contained"
                      startIcon={<Save />}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{ 
                        mb: { xs: 1, sm: 0 }, 
                        minWidth: { sm: 120 }, 
                        flex: { xs: 1, sm: 'none' } 
                      }}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Save'}
                    </Button>

                    {activeTab === tabLabels.length - 1 ? (
                      <Button
                        fullWidth={isMobile}
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{ 
                          mb: { xs: 1, sm: 0 }, 
                          minWidth: { sm: 120 }, 
                          flex: { xs: 1, sm: 'none' } 
                        }}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={20} /> : (isEdit ? 'Update & Finish' : 'Create & Finish')}
                      </Button>
                    ) : (
                      <Button
                        fullWidth={isMobile}
                        variant="contained"
                        startIcon={isMobile ? null : <ArrowBack sx={{ transform: 'rotate(180deg)' }} />}
                        endIcon={isMobile ? <ArrowBack sx={{ transform: 'rotate(180deg)' }} /> : null}
                        onClick={handleNext}
                        size={isMobile ? 'small' : 'medium'}
                        sx={{ 
                          mb: { xs: 1, sm: 0 }, 
                          minWidth: { sm: 120 }, 
                          flex: { xs: 1, sm: 'none' } 
                        }}
                      >
                        {isMobile ? 'Next' : 'Next'}
                      </Button>
                    )}
                  </Box>

                  <Button
                    fullWidth={isMobile}
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => navigate('/admin/courses')}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      order: { xs: 2, sm: 2 },
                      mt: { xs: 2, sm: 0 }, // Increased margin top on mobile
                      ml: { xs: 0, sm: 'auto' }, // Align right on desktop
                      minWidth: { sm: 120 },
                      flex: { xs: 1, sm: 'none' }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            )}
          </Paper>
          <Dialog 
            open={resourceDialogOpen} 
            onClose={() => setResourceDialogOpen(false)}
            fullScreen={isMobile}
          >
            <DialogTitle>
              {currentResource.id ? 'Edit Resource' : 'Add Resource'}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Resource Title"
                fullWidth
                name="title"
                value={currentResource.title}
                onChange={handleResourceChange}
                sx={{ mb: 2 }}
                size={isMobile ? 'small' : 'medium'}
                error={!!errors.resourceTitle}
                helperText={errors.resourceTitle}
              />

              <FormControl fullWidth sx={{ mb: 2 }} size={isMobile ? 'small' : 'medium'}>
                <InputLabel>Resource Type</InputLabel>
                <Select
                  name="type"
                  value={currentResource.type}
                  onChange={handleResourceChange}
                  label="Resource Type"
                >
                  {resourceTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {type.icon}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {currentResource.type === 'link' && (
                <TextField
                  margin="dense"
                  label="URL"
                  fullWidth
                  name="url"
                  value={currentResource.url}
                  onChange={handleResourceChange}
                  size={isMobile ? 'small' : 'medium'}
                  error={!!errors.resourceUrl}
                  helperText={errors.resourceUrl}
                />
              )}

              {(currentResource.type === 'pdf' || currentResource.type === 'video' || currentResource.type === 'file') && (
                <Button
                  fullWidth
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ mt: 1 }}
                  size={isMobile ? 'small' : 'medium'}
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={handleResourceFileChange}
                    accept={
                      currentResource.type === 'pdf' ? 'application/pdf' : 
                      currentResource.type === 'video' ? 'video/*' : '*'
                    }
                  />
                </Button>
              )}

              {currentResource.file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {currentResource.file.name || currentResource.file}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setResourceDialogOpen(false)}
                size={isMobile ? 'small' : 'medium'}
              >
                Cancel
              </Button>
              <Button 
                onClick={saveResource} 
                disabled={loading || !currentResource.title.trim()}
                variant="contained"
                size={isMobile ? 'small' : 'medium'}
              >
                {loading ? <CircularProgress size={20} /> : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog 
            open={categoryDialogOpen} 
            onClose={() => setCategoryDialogOpen(false)}
            fullWidth
            maxWidth="sm"
            fullScreen={isMobile}
          >
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Category Name"
                fullWidth
                name="name"
                value={newCategory.name}
                onChange={handleCategoryChange}
                error={!!errors.categoryName}
                helperText={errors.categoryName}
                sx={{ mb: 2 }}
                size={isMobile ? 'small' : 'medium'}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                name="description"
                value={newCategory.description}
                onChange={handleCategoryChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
                size={isMobile ? 'small' : 'medium'}
              />
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setCategoryDialogOpen(false)}
                size={isMobile ? 'small' : 'medium'}
              >
                Cancel
              </Button>
              <Button 
                onClick={saveCategory}
                disabled={categoryLoading || !newCategory.name.trim()}
                variant="contained"
                size={isMobile ? 'small' : 'medium'}
              >
                {categoryLoading ? <CircularProgress size={24} /> : (editingCategory ? 'Update' : 'Add')}
              </Button>
            </DialogActions>
          </Dialog>

          <InstructorAssignmentDialog
            open={instructorDialogOpen}
            onClose={() => setInstructorDialogOpen(false)}
            modules={course.modules}
            currentAssignment={currentResource}
            onAssign={handleInstructorAssignment}
            isMobile={isMobile}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CourseForm;
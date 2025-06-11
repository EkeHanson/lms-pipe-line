import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, Chip,
  Divider, Grid, List, ListItem, ListItemText, ListItemIcon, Tabs,
  Tab, useTheme, IconButton, CircularProgress 
} from '@mui/material';
import {
  ArrowBack, Edit, People, Schedule,
  MonetizationOn, Assessment, InsertDriveFile,
  VideoLibrary, Quiz, Assignment, PictureAsPdf,
  Description, Image, Link
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { coursesAPI } from '../../../../config';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const CourseView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedResource, setExpandedResource] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const response = await coursesAPI.getCourse(id);
        setCourse(response.data);
        setError('');
      } catch (error) {
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/courses');
  };

  const handleEdit = () => {
    navigate(`/admin/courses/edit/${id}`);
  };

  const formatPrice = (price, currency) => {
    const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
    if (priceNumber === undefined || priceNumber === null || isNaN(priceNumber)) {
      return 'Price not set';
    }
    const currencyToUse = currency || 'NGN';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyToUse
      }).format(priceNumber);
    } catch (e) {
      return `${currencyToUse} ${priceNumber.toFixed(2)}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'success';
      case 'Draft': return 'warning';
      case 'Archived': return 'default';
      default: return 'info';
    }
  };

  const getLessonType = (lesson) => {
    if (lesson.lesson_type) {
      return lesson.lesson_type.toLowerCase();
    }
    const url = lesson.content_file || lesson.content_url || '';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video';
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    return 'default';
  };

  const getLessonIcon = (type) => {
    const normalizedType = type.toLowerCase();
    switch (normalizedType) {
      case 'video': return <VideoLibrary color="primary" />;
      case 'quiz': return <Quiz color="secondary" />;
      case 'assignment': return <Assignment color="info" />;
      case 'pdf': return <PictureAsPdf color="error" />;
      case 'word': return <Description color="info" />;
      case 'image': return <Image color="success" />;
      default: return <InsertDriveFile color="action" />;
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'video': return <VideoLibrary color="primary" />;
      case 'pdf': return <PictureAsPdf color="error" />;
      case 'file': return <Description color="info" />;
      case 'image': return <Image color="success" />;
      case 'link': return <Link color="primary" />;
      default: return <InsertDriveFile color="action" />;
    }
  };

  const handleToggleResource = (resourceId) => {
    setExpandedResource(expandedResource === resourceId ? null : resourceId);
  };

  const handleToggleLesson = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">{error || 'Course not found'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {course.title}
        </Typography>
        <Chip 
          label={course.status} 
          size="small" 
          color={getStatusColor(course.status)}
          sx={{ ml: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={handleEdit}
          sx={{ ml: 'auto' }}
        >
          Edit Course
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Course Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Course Description
            </Typography>
            <Typography paragraph>
              {course.description}
            </Typography>

            <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
              Learning Outcomes
            </Typography>
            <List dense>
              {course.learning_outcomes.map((outcome, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText primary={`• ${outcome}`} />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Course Content Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                  height: 3
                }
              }}
            >
              <Tab label="Modules" />
              <Tab label="Resources" />
            </Tabs>
            <Divider />

            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                {course.modules.map((module) => (
                  <Box key={module.id} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {module.description}
                    </Typography>
                    <List>
                      {module.lessons.map((lesson) => {
                        const lessonType = getLessonType(lesson);
                        const contentUrl = lesson.content_file || lesson.content_url;
                        return (
                          <Box key={lesson.id}>
                            <ListItem 
                              sx={{ 
                                py: 1,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                '&:hover': {
                                  backgroundColor: theme.palette.action.hover,
                                  cursor: 'pointer'
                                }
                              }}
                              onClick={() => handleToggleLesson(lesson.id)}
                            >
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                {getLessonIcon(lessonType)}
                              </ListItemIcon>
                              <ListItemText 
                                primary={lesson.title} 
                                secondary={
                                  lessonType === 'video' ? 'Click to play video' :
                                  lessonType === 'pdf' ? 'Click to view PDF' :
                                  lessonType === 'word' ? 'Click to view document' :
                                  lessonType === 'image' ? 'Click to view image' :
                                  lesson.duration || 'Not specified'
                                }
                              />
                            </ListItem>
                            {expandedLesson === lesson.id && contentUrl && (
                              <Box sx={{ 
                                p: 2, 
                                bgcolor: theme.palette.grey[100],
                                borderBottom: `1px solid ${theme.palette.divider}`
                              }}>
                                {lessonType === 'video' && (
                                  <Box sx={{ width: '100%' }}>
                                    <video
                                      controls
                                      src={contentUrl}
                                      style={{ width: '100%', maxHeight: '400px' }}
                                      onError={() => alert('Failed to load video')}
                                    >
                                      Your browser does not support the video tag.
                                    </video>
                                    <Button
                                      variant="outlined"
                                      href={contentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{ mt: 1 }}
                                    >
                                      Open Video in New Tab
                                    </Button>
                                  </Box>
                                )}
                                {lessonType === 'pdf' && (
                                  <Box sx={{ width: '100%' }}>
                                    {import.meta.env.DEV ? (
                                      <>
                                        <Document
                                          file={contentUrl}
                                          onLoadSuccess={onDocumentLoadSuccess}
                                          onLoadError={() => alert('Failed to load PDF')}
                                        >
                                          {Array.from(new Array(numPages), (_, index) => (
                                            <Page
                                              key={`page_${index + 1}`}
                                              pageNumber={index + 1}
                                              width={800}
                                              renderTextLayer={false}
                                              renderAnnotationLayer={false}
                                            />
                                          ))}
                                        </Document>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                          Page {1} of {numPages}
                                        </Typography>
                                      </>
                                    ) : (
                                      <iframe
                                        src={contentUrl}
                                        style={{ width: '100%', height: '500px', border: 'none' }}
                                        title={lesson.title}
                                      />
                                    )}
                                    <Button
                                      variant="outlined"
                                      href={contentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{ mt: 1 }}
                                    >
                                      {import.meta.env.DEV ? 'Download PDF' : 'Open PDF in New Tab'}
                                    </Button>
                                  </Box>
                                )}
                                {lessonType === 'word' && (
                                  <Box sx={{ width: '100%' }}>
                                    {import.meta.env.DEV ? (
                                      <Button 
                                        variant="contained" 
                                        href={contentUrl}
                                        download
                                        sx={{ mb: 2 }}
                                      >
                                        Download Word Document
                                      </Button>
                                    ) : (
                                      <iframe
                                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(contentUrl)}&embedded=true`}
                                        style={{ width: '100%', height: '500px', border: 'none' }}
                                        title={lesson.title}
                                      />
                                    )}
                                    <Button
                                      variant="outlined"
                                      href={contentUrl}
                                      target="_blank"
                                      sx={{ mt: 1 }}
                                    >
                                      {import.meta.env.DEV ? 'Open Document' : 'Download Document'}
                                    </Button>
                                  </Box>
                                )}
                                {lessonType === 'image' && (
                                  <Box sx={{ width: '100%' }}>
                                    <img
                                      src={contentUrl}
                                      alt={lesson.title}
                                      style={{ 
                                        width: '100%', 
                                        maxHeight: '500px', 
                                        objectFit: 'contain',
                                        display: 'block',
                                        margin: '0 auto'
                                      }}
                                      onError={() => alert('Failed to load image')}
                                    />
                                    <Button
                                      variant="outlined"
                                      href={contentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{ mt: 1 }}
                                    >
                                      Open Image in New Tab
                                    </Button>
                                  </Box>
                                )}
                                {lessonType === 'default' && contentUrl && (
                                  <Box>
                                    <Button
                                      variant="contained"
                                      href={contentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Download Resource
                                    </Button>
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </List>
                  </Box>
                ))}
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <List>
                  {course.resources.map((resource) => {
                    const resourceUrl = resource.url || resource.file;
                    return (
                      <Box key={resource.id}>
                        <ListItem 
                          sx={{ 
                            py: 1,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => handleToggleResource(resource.id)}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {getResourceIcon(resource.resource_type)}
                          </ListItemIcon>
                          <ListItemText 
                            primary={resource.title} 
                            secondary={
                              resource.resource_type === 'link' 
                                ? resourceUrl 
                                : resource.resource_type === 'video' 
                                ? 'Click to play video' 
                                : resource.resource_type === 'pdf' 
                                ? 'Click to view PDF' 
                                : resource.resource_type === 'file' 
                                ? 'Click to view document' 
                                : 'Resource'
                            }
                          />
                        </ListItem>
                        {expandedResource === resource.id && resourceUrl && (
                          <Box sx={{ p: 2, bgcolor: theme.palette.grey[100] }}>
                            {resource.resource_type === 'video' && (
                              <video
                                controls
                                src={resourceUrl}
                                style={{ width: '100%', maxHeight: '400px' }}
                                onError={() => alert('Failed to load video')}
                              >
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {resource.resource_type === 'pdf' && (
                              import.meta.env.DEV ? (
                                <>
                                  <Document
                                    file={resourceUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={() => alert('Failed to load PDF')}
                                  >
                                    <Page
                                      pageNumber={1}
                                      width={800}
                                      renderTextLayer={false}
                                      renderAnnotationLayer={false}
                                    />
                                  </Document>
                                  <Typography variant="body2" sx={{ mt: 1 }}>
                                    Page 1 of {numPages}
                                  </Typography>
                                </>
                              ) : (
                                <iframe
                                  src={resourceUrl}
                                  style={{ width: '100%', height: '500px', border: 'none' }}
                                  title={resource.title}
                                />
                              )
                            )}
                            {(resource.resource_type === 'file' && resourceUrl.match(/\.(doc|docx)$/i)) && (
                              import.meta.env.DEV ? (
                                <Button 
                                  variant="contained" 
                                  href={resourceUrl}
                                  download
                                  sx={{ mb: 2 }}
                                >
                                  Download Word Document
                                </Button>
                              ) : (
                                <iframe
                                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(resourceUrl)}&embedded=true`}
                                  style={{ width: '100%', height: '500px', border: 'none' }}
                                  title={resource.title}
                                />
                              )
                            )}
                            {resource.resource_type === 'link' && (
                              <Button
                                variant="contained"
                                color="primary"
                                href={resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ mt: 1 }}
                              >
                                Visit Link
                              </Button>
                            )}
                            <Button
                              variant="outlined"
                              href={resourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ mt: 1, ml: 1 }}
                            >
                              {resource.resource_type === 'link' ? 'Open Link' : 'Download'}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Course Meta */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ 
              width: '100%', 
              height: 200, 
              mb: 2,
              borderRadius: 1,
              overflow: 'hidden',
              backgroundColor: theme.palette.grey[200],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Typography color="text.secondary">No thumbnail</Typography>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <People fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Students
                </Typography>
                <Typography variant="h6">
                  {course.totalStudents || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <Schedule fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Duration
                </Typography>
                <Typography variant="h6">
                  {course.duration}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <MonetizationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Price
                </Typography>
                <Typography variant="h6">
                  {course.discount_price ? (
                    <>
                      <Typography component="span" sx={{ textDecoration: 'line-through', mr: 1 }}>
                        {formatPrice(course.price, course.currency)}
                      </Typography>
                      <Typography component="span" color="error">
                        {formatPrice(course.discount_price, course.currency)}
                      </Typography>
                    </>
                  ) : (
                    formatPrice(course.price, course.currency)
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <Assessment fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Status
                </Typography>
                <Typography variant="h6">
                  <Chip 
                    label={course.status} 
                    size="small" 
                    color={getStatusColor(course.status)}
                  />
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              Course Code
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {course.code}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {course.category?.name || 'Not specified'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Level
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {course.level}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Created
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {new Date(course.created_at).toLocaleDateString()}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body1">
              {new Date(course.updated_at).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseView;
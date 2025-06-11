import React, { useState, useEffect, useCallback, memo } from 'react';
import { throttle } from 'lodash';
import {
  Box, Paper, Typography, Grid, Card, CardMedia, CardContent,
  Button, LinearProgress, IconButton, Skeleton, Dialog,
  DialogTitle, DialogContent, DialogActions, Tabs, Tab,
  CircularProgress, Alert, Fade, TextField, MenuItem, Select,
  InputAdornment, Chip, Divider, TextareaAutosize, Modal, Slider
} from '@mui/material';
import {
  PlayCircle, Bookmark, BookmarkBorder, Search, RateReview,
  VideoLibrary, PictureAsPdf, Description, InsertDriveFile,
  FilterList, Sort, Star, StarBorder, PlayArrow, Pause,
  VolumeUp, VolumeOff, Fullscreen, FullscreenExit, Speed,
  Close, ArrowBack, ArrowForward, CheckCircle
} from '@mui/icons-material';
import { coursesAPI, API_BASE_URL } from '../../../config';

// Memoized Course Card Component
const CourseCard = memo(({ course, bookmarked, onBookmark, onOpen, onFeedback }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' },
        borderRadius: 2
      }}
      aria-label={`Course: ${course.title}`}
    >
      <Box sx={{ position: 'relative', height: 160 }}>
        {!imageLoaded && <Skeleton variant="rectangular" width="100%" height="100%" />}
        <Fade in={imageLoaded} timeout={500}>
          <CardMedia
            component="img"
            height="160"
            image={imageError ? '/default-course-thumbnail.jpg' : course.thumbnail}
            alt={course.title}
            sx={{
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none'
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => { setImageError(true); setImageLoaded(true); }}
            loading="lazy"
          />
        </Fade>
      </Box>
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }} noWrap>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {course.instructors.length > 0 ? `By ${course.instructors[0].name}` : 'No instructor'}
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <LinearProgress
            variant="determinate"
            value={course.progress}
            sx={{ width: '100%', mr: 2, height: 6, borderRadius: 3 }}
          />
          <Typography variant="body2">{Math.round(course.progress)}%</Typography>
        </Box>
        <Chip
          label={course.status.replace('_', ' ')}
          size="small"
          color={course.status === 'completed' ? 'success' : course.status === 'in_progress' ? 'primary' : 'default'}
        />
      </CardContent>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          size="small"
          startIcon={<PlayCircle />}
          onClick={() => onOpen(course)}
          color="primary"
          variant="contained"
        >
          {course.progress > 0 ? 'Continue' : 'Start'}
        </Button>
        <Box>
          <IconButton onClick={onBookmark} aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}>
            {bookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
          </IconButton>
          <Button size="small" startIcon={<RateReview />} onClick={() => onFeedback(course, 'course')}>
            Feedback
          </Button>
        </Box>
      </Box>
    </Card>
  );
});

// Loading Skeletons
const LoadingSkeletons = () => (
  <Grid container spacing={3}>
    {[1, 2, 3].map(item => (
      <Grid item xs={12} sm={6} md={4} key={item}>
        <Card>
          <Skeleton variant="rectangular" height={160} />
          <CardContent>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rectangular" height={6} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Error Display
const ErrorDisplay = ({ error }) => (
  <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
    <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
      Retry
    </Button>
  </Paper>
);

// Empty State
const EmptyState = () => (
  <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2, textAlign: 'center' }}>
    <Typography variant="h6" gutterBottom>No Enrolled Courses</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
      You haven't enrolled in any courses yet.
    </Typography>
    <Button variant="contained" startIcon={<Search />} href="/courses">
      Browse Courses
    </Button>
  </Paper>
);

// Media Player Component
const MediaPlayer = ({ open, onClose, media }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [completed, setCompleted] = useState(false);
  const videoRef = React.useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
    if (videoRef.current) {
      videoRef.current.volume = newValue / 100;
      setMuted(newValue === 0);
    }
  };

  const handleProgressChange = (e, newValue) => {
    setProgress(newValue);
    if (videoRef.current) {
      videoRef.current.currentTime = (newValue / 100) * duration;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const newProgress = (currentTime / duration) * 100;
      setProgress(newProgress);
      
      if (duration > 0 && currentTime >= duration - 1 && !completed) {
        setCompleted(true);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = volume / 100;
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleFullscreen = () => {
    if (!fullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setFullscreen(!fullscreen);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      handlePlayPause();
    } else if (e.key === 'ArrowRight') {
      if (videoRef.current) {
        videoRef.current.currentTime += 5;
      }
    } else if (e.key === 'ArrowLeft') {
      if (videoRef.current) {
        videoRef.current.currentTime -= 5;
      }
    } else if (e.key === 'm') {
      setMuted(!muted);
    } else if (e.key === 'f') {
      handleFullscreen();
    }
  };

  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.currentTime = 0;
      setPlaying(false);
      setProgress(0);
      setCompleted(false);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="media-player-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none'
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '1200px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          overflow: 'hidden',
          outline: 'none'
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <Box sx={{ position: 'relative', bgcolor: 'black' }}>
          {media.type === 'video' ? (
            <video
              ref={videoRef}
              src={media.url}
              style={{ width: '100%', display: 'block', maxHeight: '80vh' }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => {
                setPlaying(false);
                setCompleted(true);
              }}
              onClick={handlePlayPause}
              muted={muted}
            />
          ) : (
            <iframe
              src={media.url}
              style={{ width: '100%', height: '80vh', border: 'none' }}
              title={media.title}
              allowFullScreen
            />
          )}

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              p: 2,
              transition: 'opacity 0.3s',
              '&:hover': { opacity: 1 }
            }}
          >
            <Slider
              value={progress}
              onChange={handleProgressChange}
              sx={{
                color: 'primary.main',
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0px 0px 0px 8px rgba(63, 81, 181, 0.16)'
                  },
                  '&.Mui-active': {
                    width: 16,
                    height: 16
                  }
                }
              }}
            />

            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton onClick={handlePlayPause} color="inherit">
                  {playing ? <Pause /> : <PlayArrow />}
                </IconButton>
                
                <IconButton onClick={() => setMuted(!muted)} color="inherit">
                  {muted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                
                <Slider
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  sx={{
                    width: 100,
                    color: 'white',
                    '& .MuiSlider-track': { border: 'none' },
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                      '&:hover, &.Mui-focusVisible, &.Mui-active': {
                        boxShadow: 'none'
                      }
                    }
                  }}
                />
                
                <Typography variant="body2">
                  {formatTime((progress / 100) * duration)} / {formatTime(duration)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                {media.type === 'video' && (
                  <Select
                    value={playbackRate}
                    onChange={(e) => handlePlaybackRateChange(e.target.value)}
                    startAdornment={<Speed sx={{ color: 'white', mr: 1 }} />}
                    sx={{
                      color: 'white',
                      '& .MuiSelect-icon': { color: 'white' },
                      '&:before, &:after': { borderBottomColor: 'white' }
                    }}
                    variant="standard"
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <MenuItem key={rate} value={rate}>{rate}x</MenuItem>
                    ))}
                  </Select>
                )}
                
                <IconButton onClick={handleFullscreen} color="inherit">
                  {fullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Box>
            </Box>
          </Box>

          {completed && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <CheckCircle sx={{ fontSize: 80, mb: 2, color: 'success.main' }} />
              <Typography variant="h5" gutterBottom>Lesson Completed</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    setPlaying(false);
                    setProgress(0);
                    setCompleted(false);
                  }
                }}
                sx={{ mt: 2 }}
              >
                Replay
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{media.title}</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {media.description || 'No description available'}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

// Helper function to format time
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Document Viewer Component
const DocumentViewer = ({ open, onClose, document }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (open && document) {
      setLoading(true);
      setError(null);
      
      if (document.type === 'pdf') {
        setFileUrl(document.url);
        setLoading(false);
      } 
      else if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(document.type)) {
        setFileUrl(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(document.url)}`);
        setLoading(false);
      }
      else {
        fetch(document.url)
          .then(response => {
            if (!response.ok) throw new Error('Failed to load file');
            return response.blob();
          })
          .then(blob => {
            const url = URL.createObjectURL(blob);
            setFileUrl(url);
            setLoading(false);
          })
          .catch(err => {
            setError(err.message);
            setLoading(false);
          });
      }
    }

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [open, document]);

  const renderViewer = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load document: {error}
          </Alert>
          <Typography variant="body1">
            The document couldn't be displayed. You can try to 
            <Button 
              href={document.url} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ ml: 1 }}
            >
              download it
            </Button>
            instead.
          </Typography>
        </Box>
      );
    }

    if (document.type === 'pdf') {
      return (
        <iframe
          src={fileUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={document.title}
        />
      );
    }

    if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(document.type)) {
      return (
        <iframe
          src={fileUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={document.title}
        />
      );
    }

    if (['jpg', 'jpeg', 'png', 'gif'].includes(document.type)) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <img 
            src={fileUrl} 
            alt={document.title} 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
          />
        </Box>
      );
    }

    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This file type cannot be displayed in the browser.
        </Alert>
        <Typography variant="body1">
          You can download the file to view it with an appropriate application.
        </Typography>
        <Button 
          variant="contained"
          href={document.url} 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{ mt: 2 }}
        >
          Download File
        </Button>
      </Box>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="document-viewer-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none'
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '1200px',
          height: '90%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}>
          <Typography variant="h6">{document?.title}</Typography>
          <IconButton onClick={onClose} sx={{ color: 'inherit' }}>
            <Close />
          </IconButton>
        </Box>
        
        <Box sx={{ 
          flexGrow: 1, 
          bgcolor: 'grey.100',
          position: 'relative'
        }}>
          {renderViewer()}
        </Box>
        
        <Box sx={{ 
          p: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          borderTop: '1px solid', 
          borderColor: 'divider'
        }}>
          <Button 
            variant="contained"
            href={document?.url} 
            target="_blank" 
            rel="noopener noreferrer"
            startIcon={<InsertDriveFile />}
          >
            Download Original File
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Course Dialog with Feedback Form
const CourseDialog = ({ open, onClose, course, activeTab, setActiveTab, onFeedback }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackError, setFeedbackError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const renderFileIcon = (type) => {
    switch (type) {
      case 'video': return <VideoLibrary color="primary" />;
      case 'pdf': return <PictureAsPdf color="error" />;
      case 'doc': case 'docx': return <Description color="info" />;
      default: return <InsertDriveFile />;
    }
  };

  const handleOpenMedia = (item) => {
    if (item.type === 'video' || item.type === 'audio') {
      setSelectedMedia({
        url: item.content_url || item.content_file,
        title: item.title,
        description: item.description,
        type: item.type
      });
    } else {
      setSelectedDocument({
        url: item.content_url || item.content_file,
        title: item.title,
        type: item.type
      });
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) {
      setFeedbackError('Feedback cannot be empty');
      return;
    }
    try {
      await coursesAPI.submitFeedback(course.courseId, { text: feedbackText, rating: feedbackRating });
      setFeedbackText('');
      setFeedbackRating(0);
      setFeedbackError(null);
      onFeedback(course, 'course', feedbackText);
    } catch (err) {
      setFeedbackError(err.message || 'Failed to submit feedback');
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="course-dialog-title"
        TransitionProps={{ unmountOnExit: true }}
      >
        <DialogTitle id="course-dialog-title">{course.title}</DialogTitle>
        <DialogContent dividers>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
            aria-label="Course navigation tabs"
          >
            <Tab label="Modules" />
            <Tab label="Resources" />
            <Tab label="Feedback" />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              {course.modules.length > 0 ? (
                course.modules.map(module => (
                  <Box key={module.id} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {module.title}
                    </Typography>
                    {module.lessons.map(lesson => (
                      <Paper
                        key={lesson.id}
                        sx={{
                          p: 2,
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => handleOpenMedia(lesson)}
                      >
                        {renderFileIcon(lesson.type)}
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle1">{lesson.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {lesson.duration} • {lesson.type}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No modules available for this course.
                </Typography>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {course.resources.length > 0 ? (
                course.resources.map(resource => (
                  <Paper
                    key={resource.id}
                    sx={{
                      p: 2,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleOpenMedia(resource)}
                  >
                    {renderFileIcon(resource.type)}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1">{resource.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {resource.type.toUpperCase()}
                      </Typography>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No additional resources available.
                </Typography>
              )}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Provide Feedback
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Rate this course:</Typography>
                <Box display="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <IconButton
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      {feedbackRating >= star ? <Star color="primary" /> : <StarBorder />}
                    </IconButton>
                  ))}
                </Box>
              </Box>
              <TextareaAutosize
                minRows={5}
                placeholder="Share your feedback about this course..."
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  resize: 'vertical'
                }}
              />
              {feedbackError && <Alert severity="error" sx={{ mt: 2 }}>{feedbackError}</Alert>}
              <Button
                variant="contained"
                color="primary"
                onClick={handleFeedbackSubmit}
                sx={{ mt: 2 }}
                disabled={!feedbackText.trim()}
              >
                Submit Feedback
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {selectedMedia && (
        <MediaPlayer
          open={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          media={selectedMedia}
        />
      )}

      {selectedDocument && (
        <DocumentViewer
          open={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          document={selectedDocument}
        />
      )}
    </>
  );
};

const StudentCourseList = ({ onFeedback }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sort: 'title',
    view: 'all'
  });

  useEffect(() => {
    let isMounted = true;

    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await coursesAPI.getUserEnrollments();

        if (!isMounted) return;

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('No enrolled courses found');
        }

        const enrolledCourses = response.data.map(enrollment => {
          const course = enrollment.course;
          const thumbnail = course?.thumbnail
            ? `${API_BASE_URL}${course.thumbnail}`
            : '/default-course-thumbnail.jpg';
          return {
            id: enrollment.id,
            courseId: course?.id,
            title: course?.title || 'Untitled Course',
            thumbnail,
            description: course?.description || '',
            resources: course?.resources || [],
            modules: course?.modules || [],
            instructors: course?.instructors || [],
            progress: enrollment.progress || 0,
            enrolled_at: enrollment.enrolled_at,
            completed_at: enrollment.completed_at,
            status: enrollment.completed_at ? 'completed' : enrollment.progress > 0 ? 'in_progress' : 'not_started'
          };
        });

        if (isMounted) {
          setCourses(enrolledCourses);
          setBookmarks(enrolledCourses.map(() => false));
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch enrolled courses');
          setLoading(false);
        }
      }
    };

    fetchEnrolledCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let result = [...courses];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(course => course.title.toLowerCase().includes(searchLower));
    }

    if (filters.status !== 'all') {
      result = result.filter(course => course.status === filters.status);
    }

    if (filters.view === 'bookmarked') {
      result = result.filter((_, index) => bookmarks[index]);
    }

    result.sort((a, b) => {
      if (filters.sort === 'title') {
        return a.title.localeCompare(b.title);
      } else if (filters.sort === 'progress') {
        return b.progress - a.progress;
      } else if (filters.sort === 'enrolled_at') {
        return new Date(b.enrolled_at) - new Date(a.enrolled_at);
      }
      return 0;
    });

    setFilteredCourses(result);
  }, [courses, filters, bookmarks]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBookmark = useCallback(
    throttle(index => {
      setBookmarks(prev => {
        const newBookmarks = [...prev];
        newBookmarks[index] = !newBookmarks[index];
        return newBookmarks;
      });
    }, 300),
    []
  );

  const handleOpenCourse = useCallback(course => {
    setSelectedCourse(course);
    setActiveTab(0);
    setOpenCourseDialog(true);
  }, []);

  const stats = {
    total: courses.length,
    inProgress: courses.filter(c => c.status === 'in_progress').length,
    completed: courses.filter(c => c.status === 'completed').length,
    notStarted: courses.filter(c => c.status === 'not_started').length
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, mx: { xs: 2, md: 4 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>My Learning</Typography>
          <Button variant="contained" startIcon={<Search />} href="/courses">
            Browse Courses
          </Button>
        </Box>

        <Grid container spacing={2} mb={4}>
          {[
            { label: 'Total Courses', value: stats.total },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Completed', value: stats.completed },
            { label: 'Not Started', value: stats.notStarted }
          ].map(stat => (
            <Grid item xs={6} sm={3} key={stat.label}>
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{stat.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          <TextField
            size="small"
            placeholder="Search courses..."
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 200 }}
          />
          <Select
            size="small"
            value={filters.status}
            onChange={e => handleFilterChange('status', e.target.value)}
            startAdornment={<FilterList sx={{ mr: 1 }} />}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="not_started">Not Started</MenuItem>
          </Select>
          <Select
            size="small"
            value={filters.sort}
            onChange={e => handleFilterChange('sort', e.target.value)}
            startAdornment={<Sort sx={{ mr: 1 }} />}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="title">Sort by Title</MenuItem>
            <MenuItem value="progress">Sort by Progress</MenuItem>
            <MenuItem value="enrolled_at">Sort by Enrollment Date</MenuItem>
          </Select>
          <Select
            size="small"
            value={filters.view}
            onChange={e => handleFilterChange('view', e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All Courses</MenuItem>
            <MenuItem value="bookmarked">Bookmarked</MenuItem>
          </Select>
        </Box>
      </Paper>

      <Box sx={{ mx: { xs: 2, md: 4 } }}>
        {loading ? (
          <LoadingSkeletons />
        ) : error ? (
          <ErrorDisplay error={error} />
        ) : filteredCourses.length === 0 ? (
          <EmptyState />
        ) : (
          <Grid container spacing={3}>
            {filteredCourses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CourseCard
                  course={course}
                  bookmarked={bookmarks[index]}
                  onBookmark={() => handleBookmark(index)}
                  onOpen={() => handleOpenCourse(course)}
                  onFeedback={onFeedback}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {selectedCourse && (
        <CourseDialog
          open={openCourseDialog}
          onClose={() => setOpenCourseDialog(false)}
          course={selectedCourse}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onFeedback={onFeedback}
        />
      )}
    </Box>
  );
};

export default StudentCourseList;
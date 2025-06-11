import { coursesAPI } from './api';

export const enrollUser = async (courseId) => {
  try {
    const response = await coursesAPI.enrollCourse(courseId);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const bulkEnrollUsers = async (courseId, userIds) => {
  try {
    const response = await coursesAPI.bulkEnroll(courseId, userIds);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCourseEnrollments = async (courseId) => {
  try {
    const response = await coursesAPI.getEnrollments(courseId);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
/**
 * Test script to verify frontend-backend integration
 * This file can be used to test API endpoints manually
 */

import { classesAPI, assignmentsAPI, submissionsAPI, usersAPI } from '../services/api';

export const testTeacherIntegration = async () => {
  console.log('🧪 Testing Teacher Integration...');
  
  try {
    // Test 1: Get classes
    console.log('📚 Testing: Get Classes');
    const classes = await classesAPI.getClasses();
    console.log('✅ Classes fetched:', classes.length);
    
    if (classes.length > 0) {
      const firstClass = classes[0];
      
      // Test 2: Get class details with students
      console.log('👥 Testing: Get Class Details');
      const classDetails = await classesAPI.getClass(firstClass.id);
      console.log('✅ Class details fetched:', classDetails.name);
      console.log('👨‍🎓 Students in class:', classDetails.students?.length || 0);
      
      // Test 3: Get assignments for class
      console.log('📝 Testing: Get Assignments');
      const assignments = await assignmentsAPI.getAssignments();
      const classAssignments = assignments.filter(a => a.class_id === firstClass.id);
      console.log('✅ Assignments fetched:', classAssignments.length);
      
      if (classAssignments.length > 0) {
        const firstAssignment = classAssignments[0];
        
        // Test 4: Get assignment submissions
        console.log('📋 Testing: Get Assignment Submissions');
        const submissions = await submissionsAPI.getSubmissionsByAssignment(firstAssignment.id);
        console.log('✅ Submissions fetched:', submissions.length);
      }
    }
    
    // Test 5: Search students
    console.log('🔍 Testing: Search Students');
    const students = await usersAPI.searchStudents('');
    console.log('✅ Students found:', students.length);
    
    console.log('🎉 Teacher integration tests completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Teacher integration test failed:', error);
    return false;
  }
};

export const testStudentIntegration = async () => {
  console.log('🧪 Testing Student Integration...');
  
  try {
    // Test 1: Get student assignments
    console.log('📚 Testing: Get Student Assignments');
    const assignments = await assignmentsAPI.getStudentAssignments();
    console.log('✅ Student assignments fetched:', assignments.length);
    
    // Test 2: Get student submissions
    console.log('📋 Testing: Get Student Submissions');
    const submissions = await submissionsAPI.getSubmissions();
    console.log('✅ Student submissions fetched:', submissions.length);
    
    console.log('🎉 Student integration tests completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Student integration test failed:', error);
    return false;
  }
};

export const testEnrollmentFlow = async (classId, studentId) => {
  console.log('🧪 Testing Student Enrollment Flow...');
  
  try {
    // Test 1: Enroll student
    console.log('➕ Testing: Enroll Student');
    await classesAPI.enrollStudent(classId, studentId);
    console.log('✅ Student enrolled successfully');
    
    // Test 2: Verify enrollment by getting class details
    console.log('🔍 Testing: Verify Enrollment');
    const classDetails = await classesAPI.getClass(classId);
    const isEnrolled = classDetails.students?.some(s => s.id === studentId);
    console.log('✅ Enrollment verified:', isEnrolled);
    
    return isEnrolled;
    
  } catch (error) {
    console.error('❌ Enrollment test failed:', error);
    return false;
  }
};

export const testSubmissionFlow = async (assignmentId, content) => {
  console.log('🧪 Testing Assignment Submission Flow...');
  
  try {
    // Test 1: Submit assignment
    console.log('📝 Testing: Submit Assignment');
    const submission = await submissionsAPI.submitAssignment(assignmentId, { content });
    console.log('✅ Assignment submitted:', submission.id);
    
    // Test 2: Verify submission
    console.log('🔍 Testing: Verify Submission');
    const submissionDetails = await submissionsAPI.getSubmission(submission.id);
    console.log('✅ Submission verified:', submissionDetails.text_content === content);
    
    return submission;
    
  } catch (error) {
    console.error('❌ Submission test failed:', error);
    return false;
  }
};

export const testGradingFlow = async (submissionId, grade, feedback) => {
  console.log('🧪 Testing Grading Flow...');
  
  try {
    // Test 1: Grade submission
    console.log('📊 Testing: Grade Submission');
    const gradedSubmission = await submissionsAPI.gradeSubmission(submissionId, {
      grade,
      feedback
    });
    console.log('✅ Submission graded:', gradedSubmission.grade);
    
    return gradedSubmission;
    
  } catch (error) {
    console.error('❌ Grading test failed:', error);
    return false;
  }
};

// Helper function to run all tests
export const runAllTests = async (userRole = 'teacher') => {
  console.log('🚀 Starting comprehensive integration tests...');
  
  const results = {
    teacher: false,
    student: false,
    enrollment: false,
    submission: false,
    grading: false
  };
  
  if (userRole === 'teacher') {
    results.teacher = await testTeacherIntegration();
  } else {
    results.student = await testStudentIntegration();
  }
  
  console.log('📊 Test Results:', results);
  return results;
};

export default {
  testTeacherIntegration,
  testStudentIntegration,
  testEnrollmentFlow,
  testSubmissionFlow,
  testGradingFlow,
  runAllTests
};

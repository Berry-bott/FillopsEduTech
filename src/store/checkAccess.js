// File: src/utils/checkAccess.js
// This checks if user has paid for a subject

import useAuthStore from "@/store/authStore";

/**
 * Check if user has paid for a subject
 * @param {string} subjectId - The subject ID to check
 * @returns {Promise<boolean>} - true if user has access, false if not
 */
export async function checkIfUserPaidForSubject(subjectId) {
  const { accessToken } = useAuthStore.getState();
  
  if (!accessToken || !subjectId) {
    return false;
  }

  try {
    // Fetch user's paid subjects
    const response = await fetch(
      "https://fillops-server-5fuf.onrender.com/api/users/my-subjects",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch paid subjects");
      return false;
    }

    const data = await response.json();
    const paidSubjects = data.data?.subjects || [];

    // Check if the subjectId is in the paid subjects list
    const hasPaid = paidSubjects.some(
      (subject) => 
        subject.id === subjectId || 
        subject._id === subjectId ||
        subject.subjectId === subjectId
    );

    console.log("💰 Payment check:", { subjectId, hasPaid });
    return hasPaid;

  } catch (error) {
    console.error("Error checking subject access:", error);
    return false;
  }
}
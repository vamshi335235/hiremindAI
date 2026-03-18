import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const FeatureRedirect = ({ feature }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestAndRedirect = async () => {
      try {
        const res = await api.get('/resume');
        const resumes = res.data;

        if (resumes && resumes.length > 0) {
          const latestId = resumes[0]._id;
          const featurePaths = {
            'ats': `/ats/${latestId}`,
            'interview': `/interview/${latestId}`,
            'mock-interview': `/mock-interview/${latestId}`,
            'career': `/career/${latestId}`
          };
          navigate(featurePaths[feature] || '/dashboard');
        } else {
          // No resumes, go to upload
          navigate('/upload');
        }
      } catch (err) {
        console.error('Redirect failed', err);
        navigate('/dashboard');
      }
    };

    fetchLatestAndRedirect();
  }, [feature, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-slate-500 font-medium">Loading your {feature} insights...</p>
    </div>
  );
};

export default FeatureRedirect;

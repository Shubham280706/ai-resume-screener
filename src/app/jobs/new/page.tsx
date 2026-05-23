'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    seniority_level: 'Mid',
    min_experience: 0,
    max_experience: 5,
    required_skills: '',
    preferred_skills: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('experience') || name.includes('min') || name.includes('max')
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        required_skills: formData.required_skills.split(',').map((s) => s.trim()).filter(Boolean),
        preferred_skills: formData.preferred_skills.split(',').map((s) => s.trim()).filter(Boolean),
      };

      console.log('Creating job with data:', payload);

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      const job = await response.json();
      console.log('Job created successfully:', job.id);
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Create New Job</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {error && <div className="bg-red-50 text-red-800 p-4 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Senior React Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter job description and requirements..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Seniority Level</label>
              <select
                name="seniority_level"
                value={formData.seniority_level}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Min Experience (years)</label>
              <input
                type="number"
                name="min_experience"
                value={formData.min_experience}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Max Experience (years)</label>
              <input
                type="number"
                name="max_experience"
                value={formData.max_experience}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Required Skills</label>
            <input
              type="text"
              name="required_skills"
              value={formData.required_skills}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Comma-separated, e.g., React, TypeScript, Node.js"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Preferred Skills</label>
            <input
              type="text"
              name="preferred_skills"
              value={formData.preferred_skills}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Comma-separated, e.g., Next.js, GraphQL"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </form>
      </div>
    </div>
  );
}

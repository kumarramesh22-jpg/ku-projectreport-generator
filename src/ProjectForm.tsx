import { useState, type FormEvent } from 'react';
import { FilePlus2, ChevronDown } from 'lucide-react';
import { COURSES, getSpecializations, type Course } from '@/types';

interface ProjectFormProps {
  onSubmit: (data: {
    studentName: string;
    hallTicketNumber: string;
    course: Course;
    specialization: string;
    projectTopic: string;
  }) => void;
}

export default function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [studentName, setStudentName] = useState('');
  const [hallTicketNumber, setHallTicketNumber] = useState('');
  const [course, setCourse] = useState<Course | ''>('');
  const [specialization, setSpecialization] = useState('');
  const [projectTopic, setProjectTopic] = useState('');

  const specializations = course ? getSpecializations(course) : [];

  function handleCourseChange(value: Course | '') {
    setCourse(value);
    setSpecialization('');
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!course) return;
    onSubmit({
      studentName: studentName.trim(),
      hallTicketNumber: hallTicketNumber.trim().toUpperCase(),
      course,
      specialization,
      projectTopic: projectTopic.trim(),
    });
    setStudentName('');
    setHallTicketNumber('');
    setCourse('');
    setSpecialization('');
    setProjectTopic('');
  }

  return (
    <form onSubmit={handleSubmit} className="card animate-slide-up p-5 sm:p-7">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="studentName" className="input-label">
            Student Name
          </label>
          <input
            id="studentName"
            type="text"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g. Ravi Kumar"
            className="input-field"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="hallTicketNumber" className="input-label">
            Hall Ticket Number
          </label>
          <input
            id="hallTicketNumber"
            type="text"
            required
            value={hallTicketNumber}
            onChange={(e) => setHallTicketNumber(e.target.value)}
            placeholder="e.g. 21A91A0123"
            className="input-field uppercase"
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <div>
          <label htmlFor="course" className="input-label">
            Course
          </label>
          <div className="relative">
            <select
              id="course"
              required
              value={course}
              onChange={(e) => handleCourseChange(e.target.value as Course | '')}
              className="input-field appearance-none pr-10"
            >
              <option value="" disabled>
                Select a course
              </option>
              {COURSES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </div>

        <div>
          <label htmlFor="specialization" className="input-label">
            Specialization
          </label>
          <div className="relative">
            <select
              id="specialization"
              required
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              disabled={!course}
              className="input-field appearance-none pr-10 disabled:bg-ink-50 disabled:text-ink-400"
            >
              <option value="" disabled>
                {course ? 'Select a specialization' : 'Select a course first'}
              </option>
              {specializations.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="projectTopic" className="input-label">
            Project Topic
          </label>
          <textarea
            id="projectTopic"
            required
            rows={3}
            value={projectTopic}
            onChange={(e) => setProjectTopic(e.target.value)}
            placeholder="e.g. AI-Based Smart Traffic Management System Using IoT Sensors"
            className="input-field resize-none"
          />
          <p className="mt-1.5 text-xs text-ink-400">
            Describe your project topic clearly — this will appear on your report cover.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-400">Saved locally on this device — no internet required.</p>
        <button type="submit" className="btn-primary w-full sm:w-auto">
          <FilePlus2 className="h-4 w-4" />
          Submit Project Topic
        </button>
      </div>
    </form>
  );
}

import React from 'react';

const teamMembers = [
  { name: 'Alice Johnson', role: 'Project Manager', description: 'Alice is responsible for overseeing the project and ensuring that all milestones are met on time.' },
  { name: 'Bob Smith', role: 'Lead Developer', description: 'Bob leads the development team and is responsible for the overall architecture of the application.' },
  { name: 'Charlie Brown', role: 'UI/UX Designer', description: 'Charlie designs the user interfaces and ensures a great user experience.' },
  { name: 'Dana White', role: 'Backend Developer', description: 'Dana works on the server-side logic and database management.' },
  { name: 'Eve Black', role: 'Frontend Developer', description: 'Eve is responsible for implementing the visual elements that users interact with.' },
];

const Team = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Our Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2">{member.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
            <p className="text-gray-600 dark:text-gray-300">{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;

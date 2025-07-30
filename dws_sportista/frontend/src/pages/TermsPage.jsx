import React from 'react'
import UserTerms from '../components/UserTerms';
import Navbar from '../components/Navbar';

const TermsPage = () => {
    return (
        <div className="text-gray-600 font-mono">
          <div className="grid md:grid-cols-3">
            <Navbar />
            <UserTerms />
          </div>
        </div>
      );
}

export default TermsPage;
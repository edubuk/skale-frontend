import React, { useContext, useState } from 'react';
import './holder.css';
import Documents from './Documents';
import { EdubukContexts } from '../../Context/EdubukContext';
import toast from 'react-hot-toast';
import SmallLoader from '../SmallLoader/SmallLoader';

const Holder = () => {
  const { setStudentName, account, connectingWithContract } = useContext(EdubukContexts);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIssuer, setSelectedIssuer] = useState(''); // State for dropdown selection

  const getStudentData = async () => {
    try {
      setLoading(true);
      const contract = await connectingWithContract();
      const studentData = await contract.getStudentInfo(account);
      if (studentData) {
        console.log('student data ', studentData[0]);
        setStudentName(studentData[0]);
        setStudentData(studentData);
        setSelectedIssuer(studentData[1]?.[0]); // Set the first issuer as the default selection
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error('You are not registered !');
      console.log('error in fetching student data', error);
    }
  };

  return (
    <div className='holder-container'>
      <div className='greeting'>
        <h2>Welcome <span>{studentData[0]}</span> !</h2>
      </div>
      <div className='getBtn'>
        {loading ? (
          <SmallLoader />
        ) : (
          <button onClick={getStudentData}>Get Your Issued Certificates</button>
        )}
        <h3>
          Your Document Issued By:&nbsp;
          <select
            value={selectedIssuer}
            onChange={(e) => setSelectedIssuer(e.target.value)}
            className="issuer-dropdown"
          >
            {studentData[1]?.map((issuer, index) => (
              <option key={index} value={issuer}>
                {issuer}
              </option>
            ))}
          </select>
        </h3>
      </div>
      <div className='holder-doc'>
        <Documents studentData={studentData[2]} />
      </div>
    </div>
  );
};

export default Holder;

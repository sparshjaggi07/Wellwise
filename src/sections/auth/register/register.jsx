import { useState } from 'react';
import { Link } from 'react-router-dom';

import PatientForm from './initialRegistrationForms/patientForm';
import DoctorForm from './initialRegistrationForms/doctorForm';
import DispensaryForm from './initialRegistrationForms/dispensaryForm';

import MosiacIllustration from '/illustration/mosiacPattern.png';
import WellWiseLogo from '/favicon.png';

function Register() {
    const [userType, setUserType] = useState('patient');
    const [patientInitialRegistration, setPatientInitialRegistration] = useState(false);
    const [doctorInitialRegistration, setDoctorInitialRegistration] = useState(false);
    const [dispensaryInitialRegistration, setDispensaryInitialRegistration] = useState(false);
    
    return (
        <div className="h-screen w-screen bg-[#e6eaf0] sm:p-8 lg:py-8 flex items-center justify-center">
            <div className="bg-white flex w-[1335px] p-8 sm:p-14 sm:rounded-[30px] sm:drop-shadow-lg">
                <section className='hidden xl:flex flex-row justify-evenly w-full max-h-full object-cover rounded-3xl '>
                    <img src={MosiacIllustration} alt="Mosiac Illustration" className='h-full'/>
                </section>
                        
                <section className="w-full flex flex-col">
                    <div className='flex flex-row justify-center items-center gap-7 mt-5 scale-75 sm:scale-100'>
                        <img src={WellWiseLogo} alt="Well Wise Logo" className='w-[100px] h-[100px]'/>
                        <div className='text-3xl text-[#24454a] font-albulaHeavy'>Well Wise</div>
                    </div>

                    <div className="w-full xl:pl-24 md:pr-10 space-y-8 mt-7 lg:mt-10 ">
                        <Link to="/" className="flex items-center group relative">
                            <svg className="w-5 h-5 rotate-180 mt-[3px] text-slate-800 scale-90 relative transition-transform duration-300 group-hover:-translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="ml-5 text-slate-800 absolute">Back to home</div>
                        </Link>

                        <div>
                            <h1 className="text-xl font-albulaSemiBold space-y-2">
                                <div>Register yourself as</div>
                                <div className={`uppercase text-3xl font-albulaHeavy mt-2 ${userType === 'patient' ? 'text-green-400' : userType === 'doctor' ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {userType}
                                </div>
                            </h1>

                            <div className="flex rounded-full bg-gray-100 p-1 mt-3">
                                {['patient', 'doctor'].map((type, index) => (
                                    <button key={index} className={`w-full text-sm font-albulaBold px-6 py-3 rounded-full transition-colors ${ userType === type ? type === 'patient' ? 'bg-green-400 text-white shadow' : type === 'doctor' ? 'bg-yellow-400 text-white shadow' : 'bg-red-400 text-white shadow' : 'text-gray-500 hover:text-gray-900' }`} onClick={() => setUserType(type)} >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                                
                            <div className='mt-5'>
                                {userType === 'patient' && ( <PatientForm setInitialRegistration={setPatientInitialRegistration}/> )}
                                {userType === 'doctor' && ( <DoctorForm setInitialRegistration={setDoctorInitialRegistration}/> )}
                                {/* {userType === 'dispensary' && ( <DispensaryForm setInitialRegistration={setDispensaryInitialRegistration}/> )} */}
                            </div>

                            <div className="text-center text-sm text-gray-500 font-albulaMedium mt-5">
                                <span>Already Registered?{' '}</span>
                                <Link to="/login" className="text-gray-900 hover:underline"> Log in </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Register;
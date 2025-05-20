import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DoctorRegistration from '../../../build/contracts/DoctorRegistration.json';
import Web3 from 'web3';

function DoctorDashboard() {
    const { licenseNumber } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [doctorDetails, setDoctorDetails] = useState(null);

    useEffect(() => {
        console.log("Updated Doctor Details: ", doctorDetails);
        console.log(licenseNumber);
    }, [doctorDetails]);    

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = DoctorRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            DoctorRegistration.abi,
                            deployedNetwork.address
                        );

                        const doctorCredentials = await contractInstance.methods
                            .getDoctorCredentials(licenseNumber)
                            .call();
                        
                        const doctorPersonalDetails = await contractInstance.methods
                            .getDoctorPersonalDetails(licenseNumber)
                            .call();
                        
                        const doctorContactDetails = await contractInstance.methods
                            .getDoctorContactDetails(licenseNumber)
                            .call();
                        
                        const doctorEducationalDetails = await contractInstance.methods
                            .getDoctorEducationalDetails(licenseNumber)
                            .call();
                        
                        const doctorProfessionalDetails = await contractInstance.methods
                            .getDoctorProfessionalDetails(licenseNumber)
                            .call();

                        setDoctorDetails({
                            credentials: {
                                walletAddress: String(doctorCredentials[0]),
                                name: String(doctorCredentials[1]),
                                licenseNumber: String(doctorCredentials[2]),
                                email: String(doctorCredentials[3]),
                            },
                            personalDetails: {
                                gender: String(doctorPersonalDetails[0]),
                                age: String(doctorPersonalDetails[1]),
                                date: String(doctorPersonalDetails[2]),
                                month: String(doctorPersonalDetails[3]),
                                year: String(doctorPersonalDetails[4]),
                                maritalStatus: String(doctorPersonalDetails[5]),
                            },
                            contactDetails: {
                                contactNumber: String(doctorContactDetails[0]),
                                appartmentNumber: String(doctorContactDetails[1]),
                                street: String(doctorContactDetails[2]),
                                city: String(doctorContactDetails[3]),
                                state: String(doctorContactDetails[4]),
                                country: String(doctorContactDetails[5]),
                            },
                            educationalDetails: {
                                specialization: String(doctorEducationalDetails[0]),
                                highestQualification: String(doctorEducationalDetails[1]),
                                experience: String(doctorEducationalDetails[2]),
                                medicalSchool: String(doctorEducationalDetails[3]),
                                graduationYear: String(doctorEducationalDetails[4]),
                            },
                            professionalDetails: {
                                hospitalName: String(doctorProfessionalDetails[0]),
                                designation: String(doctorProfessionalDetails[1]),
                                department: String(doctorProfessionalDetails[2]),
                                consultantFees: String(doctorProfessionalDetails[3]),
                            },
                        });
                    } else {
                        setError('Smart contract not deployed on the detected network.');
                    }
                } catch (err) {
                    setError('Error accessing MetaMask or fetching data.');
                }
            } else {
                setError('MetaMask not detected. Please install the MetaMask extension.');
            }
            setLoading(false);
        };

        init();
    }, [licenseNumber]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    if (error) {
        return (
            <div className="text-red-500 bg-red-100 p-4 rounded-md mt-5 mx-auto max-w-md text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="p-5 bg-green-50 min-h-screen">
            <h1 className="text-3xl font-bold text-green-700 text-center mb-5">
                Doctor Dashboard
            </h1>
            <div className="max-w-4xl mx-auto space-y-5">
                <section className="bg-white shadow-md rounded-lg p-5">
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">Credentials</h2>
                    <p><strong>Name:</strong> {doctorDetails.credentials.walletAddress}</p>
                    <p><strong>License Number:</strong> {doctorDetails.credentials.name}</p>
                    <p><strong>Email:</strong> {doctorDetails.credentials.licenseNumber}</p>
                    <p><strong>Wallet Address:</strong> {doctorDetails.credentials.email}</p>
                </section>

                <section className="bg-white shadow-md rounded-lg p-5">
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">Personal Details</h2>
                    <p><strong>Gender:</strong> {doctorDetails.personalDetails.gender}</p>
                    <p><strong>Age:</strong> {doctorDetails.personalDetails.age}</p>
                    <p>
                        <strong>Date of Birth:</strong>{' '}
                        {`${doctorDetails.personalDetails.date}/${doctorDetails.personalDetails.month}/${doctorDetails.personalDetails.year}`}
                    </p>
                    <p><strong>Marital Status:</strong> {doctorDetails.personalDetails.maritalStatus}</p>
                </section>

                <section className="bg-white shadow-md rounded-lg p-5">
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">Contact Details</h2>
                    <p><strong>Contact Number:</strong> {doctorDetails.contactDetails.contactNumber}</p>
                    <p><strong>Apartment Number:</strong> {doctorDetails.contactDetails.appartmentNumber}</p>
                    <p><strong>Street:</strong> {doctorDetails.contactDetails.street}</p>
                    <p><strong>City:</strong> {doctorDetails.contactDetails.city}</p>
                    <p><strong>State:</strong> {doctorDetails.contactDetails.state}</p>
                    <p><strong>Country:</strong> {doctorDetails.contactDetails.country}</p>
                </section>

                <section className="bg-white shadow-md rounded-lg p-5">
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">Educational Details</h2>
                    <p><strong>Specialization:</strong> {doctorDetails.educationalDetails.specialization}</p>
                    <p><strong>Highest Qualification:</strong> {doctorDetails.educationalDetails.highestQualification}</p>
                    <p><strong>Experience:</strong> {doctorDetails.educationalDetails.experience}</p>
                    <p><strong>Medical School:</strong> {doctorDetails.educationalDetails.medicalSchool}</p>
                    <p><strong>Graduation Year:</strong> {doctorDetails.educationalDetails.graduationYear}</p>
                </section>

                <section className="bg-white shadow-md rounded-lg p-5">
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">Professional Details</h2>
                    <p><strong>Hospital Name:</strong> {doctorDetails.professionalDetails.hospitalName}</p>
                    <p><strong>Designation:</strong> {doctorDetails.professionalDetails.designation}</p>
                    <p><strong>Department:</strong> {doctorDetails.professionalDetails.department}</p>
                    <p><strong>Consultant Fees:</strong> {doctorDetails.professionalDetails.consultantFees}</p>
                </section>
            </div>
        </div>
    );
}

export default DoctorDashboard;
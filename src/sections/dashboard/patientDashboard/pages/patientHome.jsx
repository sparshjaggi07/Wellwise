import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PatientRegistration from '../../../../build/contracts/PatientRegistration.json';
import MentalHealth from '../../../../build/contracts/MentalHealth.json';
import Web3 from 'web3';

import '../../../../globalStyles.css'
import D_BRAIN from '/illustration/D_BRAIN.png';

function PatientDashboard() {
    const { healthID } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [patientDetails, setPatientDetails] = useState(null);
    const [testIDS, setTestIDS] = useState([]);

    useEffect(() => {
        console.log("Updated Patient Details: ", patientDetails);
    }, [patientDetails]);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
    
                    const networkId = await web3Instance.eth.net.getId();
                    const patientDeployedNetwork = PatientRegistration.networks[networkId];
    
                    if (patientDeployedNetwork) {
                        const patientContract = new web3Instance.eth.Contract(
                            PatientRegistration.abi,
                            patientDeployedNetwork.address
                        );
    
                        const patientCredentials = await patientContract.methods
                            .getPatientCredentials(healthID)
                            .call();
    
                        const patientPersonalDetails = await patientContract.methods
                            .getPatientPersonalDetails(healthID)
                            .call();
    
                        const patientContactDetails = await patientContract.methods
                            .getPatientContactDetails(healthID)
                            .call();
    
                        const patientMedicalDetails = await patientContract.methods
                            .getPatientMedicalDetails(healthID)
                            .call();
    
                        const patientLifeStyleDetails = await patientContract.methods
                            .getPatientLifestyleDetails(healthID)
                            .call();
    
                        const patientPolicyDetails = await patientContract.methods
                            .getPatientPolicyDetails(healthID)
                            .call();
    
                        setPatientDetails({
                            credentials: {
                                walletAddress: patientCredentials[0],
                                name: String(patientCredentials[1]),
                                healthID: String(patientCredentials[2]),
                                email: String(patientCredentials[3]),
                            },
                            personalDetails: {
                                gender: String(patientPersonalDetails[0]),
                                age: String(patientPersonalDetails[1]),
                                date: String(patientPersonalDetails[2]),
                                month: String(patientPersonalDetails[3]),
                                year: String(patientPersonalDetails[4]),
                                maritalStatus: String(patientPersonalDetails[5]),
                                disabilities: String(patientPersonalDetails[6]),
                            },
                            contactDetails: {
                                contactNumber: String(patientContactDetails[0]),
                                apartmentNumber: String(patientContactDetails[1]),
                                street: String(patientContactDetails[2]),
                                city: String(patientContactDetails[3]),
                                state: String(patientContactDetails[4]),
                                country: String(patientContactDetails[5]),
                            },
                            medicalDetails: {
                                weight: String(patientMedicalDetails[0]),
                                feet: String(patientMedicalDetails[1]),
                                inches: String(patientMedicalDetails[2]),
                                allergies: String(patientMedicalDetails[3]),
                                isDiabetic: patientMedicalDetails[4],
                                isHypertension: patientMedicalDetails[5],
                            },
                            lifeStyleDetails: {
                                smokingStatus: String(patientLifeStyleDetails[0]),
                                alcoholConsumption: String(patientLifeStyleDetails[1]),
                                exerciseHabit: String(patientLifeStyleDetails[2]),
                            },
                            policyDetails: {
                                insuranceProvider: String(patientPolicyDetails[0]),
                                policyNumber: String(patientPolicyDetails[1]),
                            },
                        });
                    } else {
                        setError('PatientRegistration smart contract not deployed on the detected network.');
                    }
    
                    const mentalHealthDeployedNetwork = MentalHealth.networks[networkId];
                    if (mentalHealthDeployedNetwork) {
                        const mentalHealthContract = new web3Instance.eth.Contract(
                            MentalHealth.abi,
                            mentalHealthDeployedNetwork.address
                        );
    
                        const fetchedTestIDs = await mentalHealthContract.methods
                            .getAllTestIDs(healthID)
                            .call();
    
                        setTestIDS(fetchedTestIDs);
    
                        for (const testID of fetchedTestIDs) {
                            const fetchedChildhoodDetails = await mentalHealthContract.methods
                                .getChildhoodDetails(testID)
                                .call();
    
                            const fetchedPHQ9Details = await mentalHealthContract.methods
                                .getPHQ9Details(testID)
                                .call();

                            const fetchSentimentDetails = await mentalHealthContract.methods
                                .getSentimentDetails(testID)
                                .call();
    
                            console.log(`Details for Test ID ${testID}:`);
                            console.log('Childhood Details:', fetchedChildhoodDetails);
                            console.log('PHQ-9 Details:', fetchedPHQ9Details);
                            console.log('Sentiment Details: ', fetchSentimentDetails);
                        }
                    } else {
                        setError('MentalHealth smart contract not deployed on the detected network.');
                    }
                } catch (err) {
                    console.error(err);
                    setError('Error accessing MetaMask or fetching data.');
                }
            } else {
                setError('MetaMask not detected. Please install the MetaMask extension.');
            }
            setLoading(false);
        };
    
        init();
    }, [healthID]);
    

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return (
            <div className="text-red-500 bg-red-100 p-4 rounded-md mt-5 mx-auto max-w-md text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="fixed w-[calc(100%-160px)] h-screen p-10 font-albulaRegular">
            <div id="rowOne" className="flex flex-row justify-between items-center">
                <div className="w-[500px] h-[550px] text-[#1a5252] bg-[#d4eceb] rounded-[50px] font-albulaHeavy text-3xl">
                    <div className="mt-5 px-14 pt-10">Patient Tests</div>
                    <div className="mt-10">
                        {testIDS.length > 0 ? (
                            testIDS.map((testID) => (
                                <Link key={testID} to={`/patient/${healthID}/mht/${testID}`}>
                                    <button className="w-full h-[70px] font-albulaRegular text-[#1a5252] text-lg py-2 hover:bg-[#e7f3f2] border-2 border-transparent hover:border-[#1a5252] rounded-md mb-2 transition-all">
                                        {`Test ID: ${testID}`}
                                    </button>
                                </Link>
                            ))
                        ) : (
                            <div className="text-xl mt-4 text-center">Patient Have Not Gone Through Any Test.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientDashboard;
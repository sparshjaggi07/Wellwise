import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientRegistration from '../../../../../build/contracts/PatientRegistration.json';
import Web3 from 'web3';
import WellWiseLogo from '/favicon.png';

import PersonalDetails from './forms/personalDetailForm';
import ContactDetails from './forms/contactDetailForm';
import MedicalDetails from './forms/medicalDetailForm';
import LifeStyleDetails from './forms/lifestyleDetailForm';
import InsuranceDetails from './forms/insuranceDetailForm';

function Register() {
    const { uniqueID } = useParams();
    const healthId = `${uniqueID}`;

    const [patient, setPatient] = useState(null);
    const [connectedAccount, setConnectedAccount] = useState("");
    const [web3, setWeb3] = useState();
    const [contract, setContract] = useState();

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    setConnectedAccount(accounts[0]);

                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = PatientRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            PatientRegistration.abi,
                            deployedNetwork.address
                        );
                        setContract(contractInstance);

                        console.log("Patient Smart contract loaded successfully.");

                        const patientCredentials = await contractInstance.methods
                            .getPatientCredentials(healthId)
                            .call();

                            const formattedDetails = {
                                walletAddress: patientCredentials[0],
                                name: patientCredentials[1],
                                healthID: patientCredentials[2],
                                email: patientCredentials[3],
                            };

                            setPatient(formattedDetails);
                    } else {
                        console.error("Patient Smart contract not deployed on the detected network.");
                    }
                } catch (error) {
                    console.error("Error accessing MetaMask or contract:", error);
                }
            } else {
                alert("MetaMask not detected. Please install the MetaMask extension.");
                console.error("MetaMask not detected. Please install the MetaMask extension.");
            }
        };

        init();
    }, []);    

    const [personalSubmit, setPersonalSubmit] = useState(false);
    const [contactSubmit, setContactSubmit] = useState(false);
    const [medicalSubmit, setMedicalSubmit] = useState(false);
    const [lifeStyleSubmit, setLifeStyleSubmit] = useState(false);
    const [insuranceSubmit, setInsuranceSubmit] = useState(false);
    
    return (
        <div className="h-screen w-screen bg-[#e6eaf0] sm:p-8 lg:py-8 flex items-center justify-center">
            <div className={`w-fit bg-white flex  p-8 sm:p-14 sm:rounded-[30px] sm:drop-shadow-lg`}>
                <div className="p-4">
                    {patient ? (
                        <div>
                            <section className="flex flex-col items-center">
                                <div id="header" className="w-full flex justify-start">
                                    <img src={WellWiseLogo} alt="Well Wise Logo" className="w-[75px] h-[75px]" />
                                    <div className="ml-6">
                                        <div className="w-full text-3xl text-start font-albulaBold">
                                            Welcome,
                                        </div>
                                        <div className="w-full text-3xl text-start font-albulaHeavy capitalize mt-1 text-[#24454a]">
                                            {patient.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-[600px] h-[2px] mt-5 bg-slate-300 rounded-full"></div>
                                <div id="timeline" className="mt-8">
                                    <div className="w-[600px] flex justify-around items-center">
                                        <div className="font-albulaRegular text-sm text-center"> Personal <br /> Details </div>
                                        <div className="font-albulaRegular text-sm text-center"> Contact <br /> Details </div>
                                        <div className="font-albulaRegular text-sm text-center"> Medical <br /> Details </div>
                                        <div className="font-albulaRegular text-sm text-center"> Life Style <br /> Details </div>
                                        <div className="font-albulaRegular text-sm text-center"> Insurance <br /> Details </div>
                                    </div>

                                    <div className="w-[600px] h-[7px] mt-6 bg-slate-300 rounded-full relative flex justify-around items-center">
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">1</div>
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">2</div>
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">3</div>
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">4</div>
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">5</div>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-14">
                                {!personalSubmit && !contactSubmit && !medicalSubmit && !lifeStyleSubmit && !insuranceSubmit && <PersonalDetails setPersonalSubmit={setPersonalSubmit} patient={patient}/>}
                                {personalSubmit && !contactSubmit && !medicalSubmit && !lifeStyleSubmit && !insuranceSubmit && <ContactDetails setContactSubmit={setContactSubmit} patient={patient}/>}
                                {personalSubmit && contactSubmit && !medicalSubmit && !lifeStyleSubmit && !insuranceSubmit && <MedicalDetails setMedicalSubmit={setMedicalSubmit} patient={patient}/>}
                                {personalSubmit && contactSubmit && medicalSubmit && !lifeStyleSubmit && !insuranceSubmit && <LifeStyleDetails setLifeStyleSubmit={setLifeStyleSubmit} patient={patient}/>}
                                {personalSubmit && contactSubmit && medicalSubmit && lifeStyleSubmit && !insuranceSubmit && <InsuranceDetails setInsuranceSubmit={setInsuranceSubmit} patient={patient}/>}
                            </section>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;
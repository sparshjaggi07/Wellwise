import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import PatientRegistration from '../../../../../build/contracts/PatientRegistration.json';
import MentalHealth from '../../../../../build/contracts/MentalHealth.json';
import Web3 from 'web3';

import WellWiseLogo from '/favicon.png';

import Lottie from "react-lottie";
import loaderAnimation from "/public/animations/loaderGreen.json";

import ChildhoodSection from "./sections/childhoodSection";
import PHQ9Section from "./sections/phq9Section";
import SentimentAnalysis from "./sections/sentimentAnalysis";
import Disclaimer from "./mhtDisclaimer.jsx";
import VideoFeed from "./videoFeed.jsx"

import PopUp from "./report.jsx";

function PatientMentalHealthDashboard() {
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    
    const { healthID } = useParams();
    const [patient, setPatient] = useState(null);
    const [connectedAccount, setConnectedAccount] = useState("");
    const [web3, setWeb3] = useState();
    const [patientContract, setPatientContract] = useState();

    const [sectionScore, setSectonScore] = useState({
        sectionOne: 0,
        sectionTwo: 0
    });

    const navigate = useNavigate();

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
                        setPatientContract(contractInstance);
    
                        console.log("Patient Smart contract loaded successfully.");
    
                        const patientCredentials = await contractInstance.methods
                            .getPatientCredentials(healthID)
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
    }, [healthID]);

    const [session, setSession] = useState(false);

    const [testID, setTestID] = useState("");

    const generateUniqueTestID = (healthID) => {
        if (!healthID) return "";
        return `${healthID}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    };
    
    useEffect(() => {
        setTestID(generateUniqueTestID(healthID));
    }, [healthID]);

    const initializeTest = async (e) => {
        e.preventDefault();
        try {
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                MentalHealth.abi,
                MentalHealth.networks[networkId].address
            );

            console.log(testID);

            await contract.methods
                .initializePatientMHTest(
                    patient.healthID,
                    testID,
                    patient.walletAddress
                )
                .send({ from: patient.walletAddress });

            setIsLoading(false);
            setShowDisclaimer(false);
            console.log("Initialized MHT");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while Initializing your MT.");
            console.log("Initialization Error:", error);
        }
    };

    const handleAccept = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSession(true);
        initializeTest(e);
    };

    const loaderOptions = {
        loop: true,
        autoplay: true,
        animationData: loaderAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const steps = [
        { id: 1, title: "History & Background Info", description: "Getting to know more about patient." },
        { id: 2, title: "PHQ-9 Questionnaire", description: "Evaluate depression levels with PHQ-9." },
        { id: 3, title: "Sentiment Analysis", description: "ML Based sentiment analysis of text and audio." },
        { id: 4, title: "Facial Behavior Analysis", description: "Analyzing facial expressions using Computer Vision." }
    ];    

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-[#e6eaf0]">
                <Lottie options={loaderOptions} height={150} width={150} />
            </div>
        );
    }

    if (showDisclaimer) {
        return (
            <Disclaimer handleAccept={handleAccept}/>
        );
    }

    const handleFinish = () => {
        setSession(false);
    };

    return (
        <>
            <div className="w-screen h-screen bg-[#e6eaf0] flex justify-center items-center">
                <div className="bg-white w-full h-full flex flex-row justify-between">
                    <div id="progressTracker" className="w-[800px] h-full p-10 flex flex-col justify-between border-r-2">
                        <div className='flex flex-row justify-center items-center gap-7 scale-75 sm:scale-100'>
                            <img src={WellWiseLogo} alt="Well Wise Logo" className='w-[100px] h-[100px]'/>
                            <div className='text-3xl text-[#24454a] font-albulaHeavy flex flex-col justify-center items-center'>
                                <div>Well Wise</div>
                                <div className="font-albulaLight text-sm">DETECT, PREVENT & CURE</div>
                            </div>
                        </div>

                        <div>
                            <div className="mt-12">
                                {steps.map((step, index) => (
                                    <div key={step.id} className={`relative flex items-center py-5 px-8 rounded-3xl ${currentStep === step.id ? "bg-[#eef8f7]" : "" } cursor-pointer`}>
                                        {index < steps.length - 1 && ( <div className={`absolute left-[50px] top-[63px] w-[3px] h-[50px] z-10 ${currentStep >= step.id ? "bg-[#266666]" : "bg-gray-300" }`} ></div> )}
                                        
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black border-[3px] font-mono ${currentStep === step.id ? "border-[#266666] bg-white" : ""} ${currentStep > step.id ? "bg-[#266666]" : "bg-transparent"}`} >
                                            {currentStep > step.id ? (
                                                <span className="material-icons text-sm"></span>
                                            ) : (
                                                step.id
                                            )}
                                        </div>

                                        <div className="ml-6">
                                            <h3 className={`text-lg font-albulaSemiBold ${ currentStep >= step.id ? "text-[#266666]" : "text-gray-500" }`} >
                                                {step.title}
                                            </h3>
                                            <p className={`text-sm font-albulaRegular ${ currentStep >= step.id ? "text-[#609c9c]" : "text-gray-500" }`}>{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full flex flex-row justify-center items-center mb-7">
                                <div className="w-[450px] rounded-3xl">
                                    <VideoFeed session={session}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {currentStep === 4 && (
                        <>
                            <div>
                                <button onClick={handleFinish}>FINISH TEST</button>
                            </div>
                        </>
                    )}

                    <div className="h-full w-full">
                        {currentStep === 1 && <ChildhoodSection step={setCurrentStep} patientDetails={patient} tID={testID} />}
                        {currentStep === 2 && <PHQ9Section step={setCurrentStep} patientDetails={patient} tID={testID}/>}
                        {currentStep === 3 && <SentimentAnalysis step={setCurrentStep} patientDetails={patient} tID={testID} submitVideo={handleFinish}/>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PatientMentalHealthDashboard;
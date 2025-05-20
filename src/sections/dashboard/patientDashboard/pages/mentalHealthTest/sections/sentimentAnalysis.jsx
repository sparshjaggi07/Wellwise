import React, { useState, useRef } from "react";
import Web3 from "web3";
import axios from "axios";
import MentalHealth from "../../../../../../build/contracts/MentalHealth.json";
import { Navigate, useNavigate, useParams } from "react-router-dom";

function SentimentAnalysis({ step, patientDetails, tID }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({ textResponse: "", textTwo: "" });

    const navigate = useNavigate();
    const {healthID} = useParams();

    const questions = [
        {
            id: 1,
            text: "Can you describe how you've been feeling emotionally over the past week?",
            type: "text",
        },
        {
            id: 2,
            text: "What has been on your mind lately? Please type your response.",
            type: "text",
        },
    ];

    const handleTextChange = (e) => {
        const { value } = e.target;
        setAnswers((prevAnswers) =>
            currentQuestion === 0
                ? { ...prevAnswers, textResponse: value }
                : { ...prevAnswers, textTwo: value }
        );
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const payload = {
                text_1: answers.textResponse,
                text_2: answers.textTwo,
            };
    
            const response = await fetch("http://localhost:5000/process_sentiment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log("Response from backend:", result);
    
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                MentalHealth.abi,
                MentalHealth.networks[networkId].address
            );
    
            await contract.methods
                .initializeSentimentDetails(
                    tID, 
                    answers.textResponse, 
                    answers.textTwo,
                    result.ml_s1,
                    result.ml_s2,
                    result.score.toString()
                )
                .send({ from: patientDetails.walletAddress });
    
            const stopResponse = await axios.get('http://localhost:5000/stop_session');
            console.log(stopResponse.data);
    
            await contract.methods
                .initializeEmotionDetails(
                    tID, 
                    stopResponse.data.total_blinks.toString(),
                    stopResponse.data.blinks.toString(),
                    stopResponse.data.cv_score.toString()
                )
                .send({ from: patientDetails.walletAddress });
    
            console.log("Data successfully stored for sentiment analysis.");
            navigate(`/patient/ack/${healthID}/${tID}`);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while storing your sentiment analysis answers.");
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="w-full h-full p-10 mx-auto font-sans">
            <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col justify-between">
                <div>
                    <div className="p-6">
                        <h2 className="text-2xl font-albulaHeavy text-gray-800 mb-6">
                            Sentiment Analysis
                        </h2>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div
                                className="bg-[#266666] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <p className="text-lg font-albulaRegular text-gray-700 mb-6">
                            {questions[currentQuestion].text}
                        </p>

                        {questions[currentQuestion].type === "text" && (
                            <textarea
                                className="w-full h-[300px] font-albulaRegular p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#266666]"
                                rows="4"
                                placeholder="Type your response here..."
                                value={
                                    currentQuestion === 0
                                        ? answers.textResponse
                                        : answers.textTwo
                                }
                                onChange={handleTextChange}
                            ></textarea>
                        )}
                    </div>
                </div>

                <div className="bg-[#eef8f7] rounded-3xl px-6 py-4 flex justify-between items-center">
                    <p className="text-sm font-albulaRegular text-gray-500">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>

                    <div className="flex space-x-4">
                        <button
                            onClick={handleBack}
                            disabled={currentQuestion === 0}
                            className="px-4 py-2 rounded-xl text-slate-600 font-albulaBold disabled:hidden"
                        >
                            Back
                        </button>
                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!answers.textResponse || !answers.textTwo}
                                className={`px-10 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${
                                    answers.textResponse && answers.textTwo
                                        ? "bg-[#266666] hover:bg-[#609c9c]"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={!answers.textResponse && currentQuestion === 0}
                                className={`px-4 py-2 rounded-xl text-white ${
                                    answers.textResponse || answers.textTwo
                                        ? "bg-[#266666] hover:bg-[#609c9c]"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SentimentAnalysis;

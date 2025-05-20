// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract PatientRegistration {
    struct PatientCredentials {
        address cryptoWalletAddress;
        string name;
        string healthID;
        string email;
        string password;
    }

    struct PatientPersonalDetails {
        string gender;
        uint256 age;
        uint256 date;
        uint256 month;
        uint256 year;
        string maritalStatus;
        string disabilities;
    }

    struct PatientContactDetails {
        uint256 contactNumber;
        string appartmentNumber;
        string street;
        string city;
        string state;
        string country;
    }

    struct PatientMedicalDetails {
        uint256 weight;
        uint256 feet;
        uint256 inches;
        string allergies;
        bool isDiabetic;
        bool isHypertension;
    }

    struct PatientLifestyleDetails {
        string smokingStatus;
        string alcoholConsumption;
        string exerciseHabit;
    }

    struct PatientPolicyDetails {
        string insuranceProvider;
        uint256 policyNumber;
    }

    struct Patient {
        PatientCredentials credential;
        PatientPersonalDetails personalDetails;
        PatientContactDetails contactDetails;
        PatientMedicalDetails medicalDetails;
        PatientLifestyleDetails lifestyleDetails;
        PatientPolicyDetails policyDetails;
    }

    mapping(string => bool) public isPatientRegistered;
    mapping(string => Patient) private patients;

    event PatientRegistered(string healthID, string name, address cryptoWalletAddress);

    function registerPatientCredentials( string memory _healthID, string memory _name, string memory _email, string memory _password, address _cryptoWalletAddress ) public {
        patients[_healthID].credential = PatientCredentials({
            cryptoWalletAddress: _cryptoWalletAddress,
            name: _name,
            healthID: _healthID,
            email: _email,
            password: _password
        });

        isPatientRegistered[_healthID] = true;
        emit PatientRegistered(_healthID, _name, _cryptoWalletAddress);
    }

    function registerPatientPersonalDetails( string memory _healthID, string memory _gender, uint256 _age, uint256 _date, uint256 _month, uint256 _year, string memory _maritalStatus, string memory _disabilities ) public {
        require(isPatientRegistered[_healthID], "Patient not registered");

        patients[_healthID].personalDetails = PatientPersonalDetails({
            gender: _gender,
            age: _age,
            date: _date,
            month: _month,
            year: _year,
            maritalStatus: _maritalStatus,
            disabilities: _disabilities
        });
    }

    function registerPatientContactDetails( string memory _healthId, uint256 _contactNumber, string memory _appartmentNumber, string memory _street, string memory _city, string memory _state, string memory _country ) public {
        require(isPatientRegistered[_healthId], "Patient not registered");

        patients[_healthId].contactDetails = PatientContactDetails({
            contactNumber: _contactNumber,
            appartmentNumber: _appartmentNumber,
            street: _street,
            city: _city,
            state: _state,
            country: _country
        });
    }

    function registerPatientMedicalDetails( string memory _healthID, uint256 _weight, uint256 _feet, uint256 _inches, string memory _allergies, bool _isDiabetic, bool _isHypertension ) public {
        require(isPatientRegistered[_healthID], "Patient not registered");

        patients[_healthID].medicalDetails = PatientMedicalDetails({
            weight: _weight,
            feet: _feet,
            inches: _inches,
            allergies: _allergies,
            isDiabetic: _isDiabetic,
            isHypertension: _isHypertension
        });
    }

    function registerPatientLifestyleDetails( string memory _healthID, string memory _smokingStatus, string memory _alcoholConsumption, string memory _exerciseHabit ) public {
        require(isPatientRegistered[_healthID], "Patient not registered");

        patients[_healthID].lifestyleDetails = PatientLifestyleDetails({
            smokingStatus: _smokingStatus,
            alcoholConsumption: _alcoholConsumption,
            exerciseHabit: _exerciseHabit
        });
    }

    function registerPatientPolicyDetails( string memory _healthID, string memory _insuranceProvider, uint256 _policyNumber ) public {
        require(isPatientRegistered[_healthID], "Patient not registered");

        patients[_healthID].policyDetails = PatientPolicyDetails({
            insuranceProvider: _insuranceProvider,
            policyNumber: _policyNumber
        });
    }

    function isRegisteredPatient(string memory _healthID) public view returns (bool) {
        return isPatientRegistered[_healthID];
    }

    function validatePassword(string memory _healthID, string memory _password) public view returns (bool) {
        require(isPatientRegistered[_healthID], "Patient not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(patients[_healthID].credential.password));
    }

    function getPatientCredentials(string memory _healthID) public view returns ( address cryptoWalletAddress, string memory name, string memory healthID, string memory email ) {
        require(isPatientRegistered[_healthID], "Patient not registered");

        Patient storage patient = patients[_healthID];

        return (
            patient.credential.cryptoWalletAddress,
            patient.credential.name,
            patient.credential.healthID,
            patient.credential.email
        );
    }

    function getPatientPersonalDetails(string memory _healthID) public view returns ( string memory gender, uint256 age, uint256 date, uint256 month, uint256 year, string memory maritalStatus, string memory disabilities ) {
        require(isPatientRegistered[_healthID], "Patient not registered");

        Patient storage patient = patients[_healthID];

        return (
            patient.personalDetails.gender,
            patient.personalDetails.age,
            patient.personalDetails.date,
            patient.personalDetails.month,
            patient.personalDetails.year,
            patient.personalDetails.maritalStatus,
            patient.personalDetails.disabilities
        );
    }

    function getPatientContactDetails(string memory _healthId) public view returns ( uint256 contactNumber, string memory appartmentNumber, string memory street, string memory city, string memory state, string memory country ) {
        require(isPatientRegistered[_healthId], "Patient not registered");

        Patient storage patient = patients[_healthId];

        return (
            patient.contactDetails.contactNumber,
            patient.contactDetails.appartmentNumber,
            patient.contactDetails.street,
            patient.contactDetails.city,
            patient.contactDetails.state,
            patient.contactDetails.country
        );
    }

    function getPatientMedicalDetails(string memory _healthID) public view returns ( uint256 weight, uint256 feet, uint256 inches, string memory allergies, bool isDiabetic, bool isHypertension ) {
        require(isPatientRegistered[_healthID], "Patient not registered");

        Patient storage patient = patients[_healthID];

        return (
            patient.medicalDetails.weight,
            patient.medicalDetails.feet,
            patient.medicalDetails.inches,
            patient.medicalDetails.allergies,
            patient.medicalDetails.isDiabetic,
            patient.medicalDetails.isHypertension
        );
    }

    function getPatientLifestyleDetails(string memory _healthID) public view returns ( string memory smokingStatus, string memory alcoholConsumption, string memory exerciseHabit ) {
        require(isPatientRegistered[_healthID], "Patient not registered");

        Patient storage patient = patients[_healthID];

        return (
            patient.lifestyleDetails.smokingStatus,
            patient.lifestyleDetails.alcoholConsumption,
            patient.lifestyleDetails.exerciseHabit
        );
    }

    function getPatientPolicyDetails(string memory _healthID) public view returns ( string memory insuranceProvider, uint256 policyNumber ) {
        require(isPatientRegistered[_healthID], "Patient not registered");

        Patient storage patient = patients[_healthID];

        return (
            patient.policyDetails.insuranceProvider,
            patient.policyDetails.policyNumber
        );
    }
}
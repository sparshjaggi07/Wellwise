// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract DispensaryRegistration {
    struct dispensaryCredentials {
        address walletAddress;
        string dispensaryName;
        string licenceNumber;
        string email;
        string password;
    }

    struct dispensaryOwnerDetails {
        string ownerName;
        string ownerPhoneNumber;
        string ownerGender;
        string age;
    }

    struct dispensaryContactDetails {
        string contactNumber;
        string dispensaryWebsite;
        string operationalHours;
    }

    struct dispensary {
        dispensaryCredentials credential;
        dispensaryOwnerDetails ownerDetails;
        dispensaryContactDetails contactDetails;
    }

    mapping(string => address) private dispensaryAddresses;
    mapping(string => dispensary) private dispensaries;

    event DiagnosticRegistered(string licenseNumber, string dispensaryName, address cryptoWalletAddress);

    function registerDispensaryCredentials( 
        string memory _name, 
        string memory _licenseNumber, 
        string memory _email, 
        string memory _password 
    ) public {
        dispensaries[_licenseNumber].credential = dispensaryCredentials({
            walletAddress: msg.sender,
            dispensaryName: _name,
            licenceNumber: _licenseNumber,
            email: _email,
            password: _password
        });

        dispensaryAddresses[_licenseNumber] = msg.sender;
        emit DiagnosticRegistered(_licenseNumber, _name, msg.sender);
    }

    function registerDispensaryOwnerDetails( 
        string memory _licenseNumber, 
        string memory _ownerName,
        string memory _ownerPhoneNumber, 
        string memory _ownerGender, 
        string memory _age 
    ) public {
        require(dispensaryAddresses[_licenseNumber] != address(0), "Dispensary not found");
        dispensaries[_licenseNumber].ownerDetails = dispensaryOwnerDetails({
            ownerName: _ownerName,
            ownerPhoneNumber: _ownerPhoneNumber,
            ownerGender: _ownerGender,
            age: _age
        });
    }

    function registerDispensaryContactDetails( 
        string memory _licenseNumber, 
        string memory _contactNumber, 
        string memory _dispensaryWebsite, 
        string memory _operationalHours 
    ) public {
        require(dispensaryAddresses[_licenseNumber] != address(0), "Dispensary not found");
        dispensaries[_licenseNumber].contactDetails = dispensaryContactDetails({
            contactNumber: _contactNumber,
            dispensaryWebsite: _dispensaryWebsite,
            operationalHours: _operationalHours
        });
    }

    function validatePassword(
        string memory _licenseNumber, 
        string memory _password
    ) public view returns (bool) {
        require(dispensaryAddresses[_licenseNumber] != address(0), "Dispensary not found");
        dispensaryCredentials memory credentials = dispensaries[_licenseNumber].credential;
        return (keccak256(abi.encodePacked(credentials.password)) == keccak256(abi.encodePacked(_password)));
    }

    function isDispensaryRegistered(string memory _licenseNumber) public view returns (bool) {
        return dispensaryAddresses[_licenseNumber] != address(0);
    }

    function getDispensaryCredentials(string memory _licenseNumber) public view returns ( string memory dispensaryName, string memory licenceNumber, string memory email, address walletAddress ) {
        require(dispensaryAddresses[_licenseNumber] != address(0), "Dispensary not found");
        dispensary storage d = dispensaries[_licenseNumber];
        return (
            d.credential.dispensaryName,
            d.credential.licenceNumber,
            d.credential.email,
            d.credential.walletAddress
        );
    }

    function getDispensaryOwnerDetails(string memory _licenseNumber) public view returns ( string memory ownerName, string memory ownerPhoneNumber, string memory ownerGender, string memory age ) {
        require(dispensaryAddresses[_licenseNumber] != address(0), "Dispensary not found");
        dispensary storage d = dispensaries[_licenseNumber];
        return (
            d.ownerDetails.ownerName,
            d.ownerDetails.ownerPhoneNumber,
            d.ownerDetails.ownerGender,
            d.ownerDetails.age
        );
    }

    function getDispensaryContactDetails(string memory _licenseNumber) public view returns ( string memory contactNumber, string memory dispensaryWebsite, string memory operationalHours ) {
        require(dispensaryAddresses[_licenseNumber] != address(0), "Dispensary not found");
        dispensary storage d = dispensaries[_licenseNumber];
        return (
            d.contactDetails.contactNumber,
            d.contactDetails.dispensaryWebsite,
            d.contactDetails.operationalHours
        );
    }
}
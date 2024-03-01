import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  ChakraProvider,
  Icon,
  Text,
  FormErrorMessage,
} from "@chakra-ui/react";
import { AiFillPlusCircle } from "react-icons/ai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nhrsgicthwqsctwggxqz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocnNnaWN0aHdxc2N0d2dneHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkxNzMwODMsImV4cCI6MjAwNDc0OTA4M30.f1MhR4nYjFrCMjMnwjMUwlueADL8wZdPvu4MtrxPglk";

const supabase = createClient(supabaseUrl, supabaseKey);

const validateForm = (formData) => {
  const errors = {};
  for (const key in formData) {
    if (formData[key] === "") {
      errors[key] = true;
    }
  }
  return errors;
};

const AddPatientForm = ({ onPatientAdded }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    familyname: "",
    birthdate: "",
    sex: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstname: false,
    familyname: false,
    birthdate: false,
    sex: false,
    address: false,
  });
  const [response, setResponse] = useState(null);
  const [lastAddedPatientId, setLastAddedPatientId] = useState(null); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      try {
        const newId = uuidv4();
        const { data, error } = await supabase
          .from("patients")
          .insert([{ id: newId, ...formData }]);

        if (error) {
          console.error("Error adding patient:", error.message);
          setResponse(null); 
        } else {
          console.log("Patient added successfully:", data);
          setFormData({
            firstname: "",
            familyname: "",
            birthdate: "",
            sex: "",
            address: "",
          });
          const newPatient = { id: newId, ...formData };
          onPatientAdded(newPatient);
          setResponse("Patient added successfully");

          setLastAddedPatientId(newId);
        }
      } catch (error) {
        console.error("Error adding patient:", error.message);
        setResponse(null); 
      }
    } else {
      setFormErrors(errors);
      setResponse(null); 
    }
  };

  return (
    <ChakraProvider>
      <Box>
        {response && (
          <Text mt={2} color={response.includes("Error") ? "red" : "green"}>
            {response}
          </Text>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl
            id="firstname"
            isRequired
            isInvalid={formErrors.firstname}
          >
            <FormLabel>First name</FormLabel>
            <Input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
            <FormErrorMessage>Veuillez fournir un prénom.</FormErrorMessage>
          </FormControl>
          <FormControl
            id="familyname"
            isRequired
            isInvalid={formErrors.familyname}
          >
            <FormLabel>Family name</FormLabel>
            <Input
              type="text"
              name="familyname"
              value={formData.familyname}
              onChange={handleInputChange}
              required
            />
            <FormErrorMessage>
              Veuillez fournir un nom de famille.
            </FormErrorMessage>
          </FormControl>
          <FormControl
            id="birthdate"
            isRequired
            isInvalid={formErrors.birthdate}
          >
            <FormLabel>Birth date</FormLabel>
            <Input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleInputChange}
              required
            />
            <FormErrorMessage>
              Veuillez fournir une date de naissance.
            </FormErrorMessage>
          </FormControl>
          <FormControl id="sex" isRequired isInvalid={formErrors.sex}>
            <FormLabel>Sex</FormLabel>
            <Select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              required
            >
              <option value="">Select sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
            <FormErrorMessage>Veuillez sélectionner un sexe.</FormErrorMessage>
          </FormControl>
          <FormControl id="address" isRequired isInvalid={formErrors.address}>
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <FormErrorMessage>Veuillez fournir une adresse.</FormErrorMessage>
          </FormControl>
          <Button mt={4} colorScheme="teal" type="submit"  leftIcon={<Icon as={AiFillPlusCircle} />} onClick={handleSubmit}>
            Créer un patient
          </Button>
        </form>
        {lastAddedPatientId && (
          <Text mt={4}>
            Last added patient ID: <strong>{lastAddedPatientId}</strong>
          </Text>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default AddPatientForm;

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import "moment/locale/fr";
import "./index.css";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { AiOutlineFileAdd } from "react-icons/ai";
import {
  Box,
  Stack,
  VStack,
  ChakraProvider,
  Text,
  Input,
  FormControl,
  Button,
  Flex,
  Icon,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";
import { IoDocumentAttachOutline } from "react-icons/io5";

const supabaseUrl = "https://nhrsgicthwqsctwggxqz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocnNnaWN0aHdxc2N0d2dneHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkxNzMwODMsImV4cCI6MjAwNDc0OTA4M30.f1MhR4nYjFrCMjMnwjMUwlueADL8wZdPvu4MtrxPglk";

const supabase = createClient(supabaseUrl, supabaseKey);

const ImageCroppingStep = ({ onNextStep, onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileLoadError, setFileLoadError] = useState(null);
const rotateLeft = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.rotate(-5);
    }
  };

  // Function to rotate image to the right by 5 degrees
  const rotateRight = () => {
    if (cropperRef.current) {
      cropperRef.current.cropper.rotate(5);
    }
  };

  const cropperRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileLoadError(null);

      const img = new Image();
      img.onload = () => {
        // Proceed with setting up the Cropper component
      };
      img.onerror = (error) => {
        console.error("Image loading error:", error);
        setFileLoadError("Failed to load the image. Please select a valid image file.");
        setSelectedFile(null);
        if (cropperRef.current) {
          cropperRef.current.destroy();
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleCrop = async () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob(async (blob) => {
          try {
            const imageUrl = await handleFileUpload(blob);
            onFileChange({ blob, imageUrl });
            onNextStep(); // Move to the next step
          } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Error uploading image. Please try again.");
          }
        }, "image/jpeg");
      }
    }
  };

  const handleFileUpload = async (imageBlob) => {
    return new Promise((resolve, reject) => {
      try {
        const uniqueFileName = `photos/${uuidv4()}.jpeg`;
        supabase.storage
          .from("ocrbucket")
          .upload(uniqueFileName, imageBlob, { contentType: "image/jpeg" })
          .then(({ error }) => {
            if (error) {
              reject(error);
              return;
            }
            const imageUrl = `${supabaseUrl}/storage/v1/object/public/ocrbucket/${uniqueFileName}`;
            resolve(imageUrl);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  const ordonnanceInputRef = useRef(null); // New ref for the ordonnance input

  const handleClickOrdonnance = () => {
    ordonnanceInputRef.current.click();
  };

  return (
    <div>
      <FormControl pb={5} pt={5}>
        <FormLabel>Fichier de l'ordonnance</FormLabel>
        <Stack direction="row" align="center">
          <Button leftIcon={<AiOutlineFileAdd />} colorScheme="blue" onClick={handleClickOrdonnance}>
            Choisir un fichier ou prendre une photo
          </Button>
          <Input
            ref={ordonnanceInputRef}
            type="file"
            onChange={handleFileChange}
            hidden // Hide the default input
          />
        </Stack>
      </FormControl>
      {fileLoadError && (
        <Alert status="error">
          <AlertIcon />
          {fileLoadError}
        </Alert>
      )}
      {selectedFile && (
        <div>
          <Box display="flex" justifyContent="center" alignItems="center" pb={5}>
            <Button onClick={rotateLeft} colorScheme="teal" leftIcon={<ArrowBackIcon />} m="5px">
              Rotation
            </Button>
            <Button onClick={rotateRight} colorScheme="teal" rightIcon={<ArrowForwardIcon />} m="5px">
              Rotation
            </Button>
          </Box>
          <Cropper src={URL.createObjectURL(selectedFile)} ref={cropperRef} />
          <Button onClick={handleCrop} colorScheme="teal" mx={2} m="5px">
            Accepter la photo recadrée
          </Button>
        </div>
      )}
    </div>
  );
};

const PhotoRecadree = () => {
  const [newPatient, setNewPatient] = useState({
    id: uuidv4(),   });
  const [userId, setUserId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const uploadPhotosRef = useRef(null);

  useEffect(() => {
    if (newPatient) {
      setTimeout(() => {
        setPatient(newPatient);
      }, 10);
    }
  }, [newPatient]);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error("Error refreshing session:", error.message);
        return;
      }

      // Directly set the userId
      const userId = data.user?.id || null;
      setUserId(userId);
    };

    fetchSession();
  }, []);

  const [triggerUpload, setTriggerUpload] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();


    try {

      // Prepare the rest of the form data
      let formData = {
        patient_id: patient.id,
        user_id: userId,
      };

      // If there's a cropped image, upload it and get the URL
      if (croppedImage) {
        const imageUrl = await handleFileUpload(croppedImage);
        formData.file_url = imageUrl; // Update formData with the image URL
      }

      if (uploadedImages.length > 0) {
        formData.file_urls = uploadedImages;
      }

      // Check if a file is selected
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const imageUrl = await handleFileUpload(croppedImage); // Upload and get the image URL
        formData.file_url = imageUrl; // Update formData with the image URL

        // Update the database with the file URL
        const { updateError } = await supabase
          .from("patient_records")
          .update({ file_urls: imageUrl })
          .eq("patient_id", patient.id);

        if (updateError) {
          console.error(
            "Error updating database with file URL:",
            updateError.message
          );
          toast.error(`Error updating database for ${file.name}`);
        }
      }

      const { data: patientRecord, error: insertError } = await supabase
        .from("patient_records")
        .insert([formData]);

      if (insertError) {
        throw insertError; // Handle the error appropriately
      }

      console.log("Patient Record Added: ", patientRecord);

      setFormSubmitted(true);
      setTimeout(() => {
        window.location.reload(); // Reload or redirect as needed
      }, 20000);
    } catch (error) {
      console.error("Error in form submission: ", error);
      // Handle submission errors appropriately
      if (uploadPhotosRef.current) {
        await uploadPhotosRef.current.uploadFiles(); // Trigger the upload process
      }
    }
    setTriggerUpload(true);
  };

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    let { data: exams, error } = await supabase.from("exams").select("*");
    if (error) console.log("Error fetching data: ", error);
    else setExams(exams);
  };

  const [ordonnanceData, setOrdonnanceData] = useState({
    patient_name: "",
    ordonnance_date: "",
    usage_remaining: "",
    valid_until: "",
    file_url: "",
    first_name: "",
    date_of_birth: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [setFileUploadError] = useState(null);
  const handleFileChange = (croppedImageObj) => {
    setCroppedImage(croppedImageObj.blob); // Store the blob for uploading
    setPreviewImage(croppedImageObj.dataUrl); // Store the dataUrl for previewing
    setCurrentStep(2); // Move to the confirmation step
  };
  const [previewImage, setPreviewImage] = useState(null);

  const [setUploadSuccess] = useState(false);
  const handleConfirmationSubmit = async () => {
    try {
      // Convert the cropped image to a grayscale PDF and get the PDF URL
      const imageUrl = await handleFileUpload(croppedImage);

      // Insert data into the database with the new column
      const { error: insertError } = await supabase.from("ordonnances").insert({
        ...ordonnanceData,
        file_url: imageUrl, // New file_url field
        // Add other fields as needed
      });

      if (insertError) {
        setFileUploadError(insertError.message);
        return;
      }

      // Reset the form and state
      setOrdonnanceData({
        patient_name: "",
        ordonnance_date: "",
        usage_remaining: "",
        valid_until: "",
        file_url: "",
      });
      setCroppedImage(null);
      setFileUploadError(null);
      setUploadSuccess(true); // Set upload success to true

      // Move back to the first step
      setCurrentStep(1);
      // Reload the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 20000);
    } catch (error) {
      setFileUploadError(error.message);
    }
  };

  const ConfirmationStep = ({ onCancel, croppedImage }) => {
    return (
      <div>
        <FormControl pb={5}>
          <FormLabel>Prévisualisation de l'image recadrée</FormLabel>
          {croppedImage ? (
            <img
              src={croppedImage}
              alt="Cropped"
              style={{ maxWidth: "100%" }}
            />
          ) : (
            <Text>No image preview available</Text>
          )}
        </FormControl>
        <Button onClick={onCancel} colorScheme="gray">
          Annuler
        </Button>
      </div>
    );
  };

  const handleFileUpload = async (imageBlob) => {
    return new Promise((resolve, reject) => {
      try {
        // Using UUID for unique file naming
        const uniqueFileName = `patient_records/${uuidv4()}.jpeg`;

        supabase.storage
          .from("patient-records")
          .upload(uniqueFileName, imageBlob, {
            contentType: "image/jpeg",
          })
          .then(({ error, data }) => {
            if (error) {
              reject(error);
              return;
            }

            // Construct the URL for the uploaded image
            const imageUrl = `${supabaseUrl}/storage/v1/object/public/patient-records/${uniqueFileName}`;
            resolve(imageUrl);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <ChakraProvider>
        <Box pt={{ base: "10px", md: "10px", xl: "20px" }}>
          
          <form onSubmit={handleSubmit}>      
            <Box mt={4}>
              <Flex
                alignItems="center"
                justifyContent="center"
                mb={4}
                p={2}
                borderRadius="5px"
                backgroundColor="blue.100"
              >
                <Icon as={IoDocumentAttachOutline} boxSize={6} />
                <Text fontSize="lg" fontWeight="bold" textAlign="center">
                  Pièce jointe
                </Text>
              </Flex>
              <Box p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
                <VStack spacing={4}>
                  <FormControl id="file">
                    {currentStep === 1 && (
                      <ImageCroppingStep
                        onNextStep={() => setCurrentStep(2)}
                        onFileChange={handleFileChange}
                      />
                    )}
                    {currentStep === 2 && (
                      <ConfirmationStep
                        onSubmit={handleConfirmationSubmit}
                        onCancel={() => setCurrentStep(1)}
                        croppedImage={previewImage}
                      />
                    )}
                  </FormControl>
                </VStack>
              </Box>
            </Box>
            <Button mt={4} colorScheme="blue" type="submit" w="100%">
              ENREGISTRER
            </Button>
            {formSubmitted && (
              <Alert status="success" mt={4}>
                <AlertIcon />
                <AlertTitle mr={2}>Bravo!</AlertTitle>
                <AlertDescription>
                  Votre dossier a été créé avec succès. Vous allez être
                  rediriger vers la page d'accueil.
                </AlertDescription>
              </Alert>
            )}
          </form>
      </Box>
    </ChakraProvider>
  );
};

export default PhotoRecadree;
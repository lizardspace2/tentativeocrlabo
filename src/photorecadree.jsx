import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import moment from "moment";
import "moment/locale/fr";
import "./index.css";
import Select from "react-select";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import UploadPhotos from "./UploadPhotos";
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
  ButtonGroup,
  Center,
  InputGroup,
  FormLabel,
  InputRightAddon,
  InputLeftAddon,
  Textarea,
  NumberInput,
  NumberInputField,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { BiCommentAdd } from "react-icons/bi";
import { RiBillLine } from "react-icons/ri";
import { fr } from "date-fns/locale";
import { FaWeight, FaBriefcaseMedical, FaMicroscope } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HStack } from "@chakra-ui/react";
import { FcBusinessman, FcBusinesswoman } from "react-icons/fc";
import { BsCapsule } from "react-icons/bs";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { FaRegHospital } from "react-icons/fa";
import { MdOutgoingMail } from "react-icons/md";
import { RiTestTubeLine } from "react-icons/ri";
import { FaVial } from "react-icons/fa";
import { CiPillsBottle1 } from "react-icons/ci";
import { FaPrescriptionBottleAlt } from "react-icons/fa";
import { GiMasonJar } from "react-icons/gi";
import { LuSyringe } from "react-icons/lu";
import { GiCorkedTube } from "react-icons/gi";

const tubeIcons = {
  
};

// Create Supabase client
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
      // Clear any previous error message
      setFileLoadError(null);

      // Create a new Image object
      const img = new Image();

      // Set an onload event handler to ensure the image is fully loaded
      img.onload = () => {
        // The image has loaded successfully
        // You can proceed with setting up the Cropper component
      };

      // Handle image loading errors
      img.onerror = (error) => {
        // Log the error to the console
        console.error("Image loading error:", error);

        // Set an error message
        setFileLoadError(
          "Failed to load the image. Please select a valid image file."
        );

        // Clear the selected file and Cropper component if an error occurs
        setSelectedFile(null);
        if (cropperRef.current) {
          cropperRef.current.destroy();
        }
      };

      // Set the source of the image to the data URL
      img.src = URL.createObjectURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        croppedCanvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result;
            onFileChange({ blob, dataUrl }); // Pass both blob and dataUrl
          };
          reader.readAsDataURL(blob);
        }, "image/jpeg");
      }
    }
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
      {fileLoadError && ( // Display the error message if it exists
        <Alert status="error">
          <AlertIcon />
          {fileLoadError}
        </Alert>
      )}
      {selectedFile && (
        <div>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            pb={5}
          >
            <Button
              onClick={rotateLeft}
              colorScheme="teal"
              leftIcon={<ArrowBackIcon />}
              m="5px"
            >
              Rotation
            </Button>

            <Button
              onClick={rotateRight}
              colorScheme="teal"
              rightIcon={<ArrowForwardIcon />}
              m="5px"
            >
              Rotation
            </Button>
          </Box>
          <Cropper
            src={URL.createObjectURL(selectedFile)}
            guides={true}
            cropBoxMovable={true}
            cropBoxResizable={true}
            ref={cropperRef}
          />
          <Button onClick={handleCrop} colorScheme="teal" mx={2} m="5px">
            Accepter la photo recadrée
          </Button>
        </div>
      )}
    </div>
  );
};

const PhotoRecadree = () => {
  const [newPatient, setNewPatient] = useState(null);
  const [userId, setUserId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const uploadPhotosRef = useRef(null);
  const [selectedExam, setSelectedExam] = useState("");
  const [status, setStatus] = useState("");
  const [familyDoctor, setFamilyDoctor] = useState({
    firstName: "",
    lastName: "",
  });
  const [charge, setCharge] = useState("Laboratoire 2");
  const [selectedComment, setSelectedComment] = useState("");
  const [transmission, setTransmission] = useState("Internet");
  const [selectedFreeComment, setSelectedFreeComment] = useState("");
  const [distanceParcourue, setDistanceParcourue] = useState(0);

  const [tubes, setTubes] = useState([
    { name: "Tube héparine avec gel (Vert)", count: 0 },
    { name: "Flacon pot bouchon rouge stérile", count: 0 },
    { name: "Tube EDTA (Violet)", count: 0 },
    { name: "Tube beige (Urine)", count: 0 },
    { name: "Tube sec gel (Jaune)", count: 0 },
    { name: "Tube citrate (Bleu)", count: 0 },
    { name: "Tube fluorure (Gris)", count: 0 },
    { name: "Flacon échantillon urine", count: 0 },
    { name: "Milieu Anapath", count: 0 },
    { name: "Seringue gaz du sang", count: 0 },
    { name: "Eswab (Orange)", count: 0 },
    { name: "Eswab (Rose)", count: 0 },
    // ...and so on for each tube type
  ]);
  const AVK_OPTIONS = [
    { value: "previscan", label: "Previscan (Fluindione)" },
    { value: "coumadine", label: "Coumadine (Warfarine)" },
    { value: "sintrom", label: "Sintrom (Acenocoumarol)" },
    { value: "mini-sintrom", label: "Mini-Sintrom (Acenocoumarol)" },
  ];
  const OTHER_MED_OPTIONS = [
    { value: "levothyrox", label: "Levothyrox" },
    { value: "digoxine", label: "Digoxine" },
    { value: "tegretol", label: "Tegretol" },
    { value: "eliquis", label: "Eliquis" },
    { value: "pradaxa", label: "Pradaxa" },
    { value: "xarelto", label: "Xarelto" },
    { value: "lovenox", label: "Lovenox" },
    { value: "innohep", label: "Innohep" },
    { value: "fraxiparine", label: "Fraxiparine" },
    // add more options here if needed
  ];
  const COMMENT_OPTIONS = [
    { value: "Ordonnance au laboratoire", label: "Ordonnance au laboratoire" },
    { value: "Prélèvement sans garrot", label: "Prélèvement sans garrot" },
    {
      value: "Patient difficile à prélever",
      label: "Patient difficile à prélever",
    },
    {
      value: "Prélèvement suite à une non-conformité",
      label: "Prélèvement suite à une non-conformité",
    },
    // Add other options as needed
  ];

  useEffect(() => {
    if (newPatient) {
      // You can add a delay here using setTimeout if you want
      setTimeout(() => {
        setPatient(newPatient);
      }, 10);
    }
  }, [newPatient]);

  const [delay, setDelay] = useState("Délai résultat normal");
  const chargeOptions = [
    { value: "Laboratoire 1", label: "Laboratoire 1" },
    { value: "Laboratoire 2", label: "Laboratoire 2" },
    { value: "Laboratoire 3", label: "Laboratoire 3" },
  ];
  const [urgentComment, setUrgentComment] = useState("");
  const [selectedAVKOption, setSelectedAVKOption] = useState(
    AVK_OPTIONS[0].value
  );
  const [selectedOtherMedOption, setSelectedOtherMedOption] = useState(
    OTHER_MED_OPTIONS[0].value
  );
  const [posologieValue, setPosologieValue] = useState("");
  const [tubesError, setTubesError] = useState(false);

  // Fetch the user session and set it in state using useEffect
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

    // Check if there are any tubes selected
    const hasTubes = tubes.some((tube) => tube.count > 0);
    if (!hasTubes) {
      setTubesError(true);
      return;
    }
    setTubesError(false);

    try {
      // Prepare tube counts object
      const tubeCounts = {};
      tubes.forEach((tube) => {
        tubeCounts[tube.name] = tube.count;
      });

      // Prepare the rest of the form data
      let formData = {
        patient_id: patient.id,
        family_doctor: `${familyDoctor.firstName} ${familyDoctor.lastName}`,
        status: status,
        charge: charge,
        transmission: transmission,
        delay: delay,
        urgent_comment: urgentComment,
        weight: weight,
        height: height,
        last_period: lastPeriod,
        pregnancy_start_date: pregnancyStartDate,
        last_time_taken: lastTimeTaken,
        selected_exam: selectedExam,
        selected_comment: selectedComment,
        free_comment: selectedFreeComment,
        avk_option: selectedAVKOption,
        other_med_option: selectedOtherMedOption,
        posologie: posologieValue,
        distance_parcourue: distanceParcourue,
        tube_heparine_avec_gel_vert_count:
          tubeCounts["Tube héparine avec gel (Vert)"],
        flacon_pot_bouchon_rouge_sterile_count:
          tubeCounts["Flacon pot bouchon rouge stérile"],
        tube_edta_violet_count: tubeCounts["Tube EDTA (Violet)"],
        tube_beige_urine_count: tubeCounts["Tube beige (Urine)"],
        tube_sec_gel_jaune_count: tubeCounts["Tube sec gel (Jaune)"],
        tube_citrate_bleu_count: tubeCounts["Tube citrate (Bleu)"],
        tube_fluorure_gris_count: tubeCounts["Tube fluorure (Gris)"],
        flacon_echantillon_urine_count: tubeCounts["Flacon échantillon urine"],
        milieu_anapath_count: tubeCounts["Milieu Anapath"],
        seringue_gaz_du_sang_count: tubeCounts["Seringue gaz du sang"],
        eswab_orange_count: tubeCounts["Eswab (Orange)"],
        eswab_rose_count: tubeCounts["Eswab (Rose)"],
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

  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [lastPeriod, setLastPeriod] = useState(null);
  const [pregnancyStartDate, setPregnancyStartDate] = useState(null);

  const [lastTimeTaken, setLastTimeTaken] = useState(null);
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

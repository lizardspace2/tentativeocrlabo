import React from 'react';
import { Box, VStack, Flex, Spacer, Text, ChakraProvider } from '@chakra-ui/react';
import { IoFemaleSharp, IoMaleSharp } from 'react-icons/io5';
import { FaBars } from 'react-icons/fa';
import moment from 'moment';

const PatientDetail = ({ patient }) => {
  const calculateAge = (birthdate) => {
    return moment().diff(moment(birthdate, 'YYYY-MM-DD'), 'years');
  };

  return (
    <ChakraProvider>
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        bgColor={patient.sex === 'Male' ? 'blue.50' : 'pink.50'}
      >
        <Flex direction="row" align="center">
          <Flex direction="row" align="center" fontSize="24px" pr="10px">
            <FaBars />
            <Box ml={2}>
              {patient.sex === 'Male' ? (
                <IoMaleSharp color="blue" />
              ) : (
                <IoFemaleSharp color="pink" />
              )}
            </Box>
          </Flex>
          <Spacer />
          <VStack align="start" spacing={1}>
            <Text>
              <strong>
                {patient.firstname || 'No First Name'}{' '}
                {patient.familyname || 'No Family Name'}
              </strong>
            </Text>
            <Text>
              <strong>
                {patient.birthdate
                  ? moment(patient.birthdate).locale('fr').format('LL')
                  : 'No Birth Date'}
              </strong>
              <strong> - </strong>
              <strong>
                {patient.birthdate
                  ? calculateAge(patient.birthdate) + ' ans'
                  : 'No Age'}
              </strong>
            </Text>
            <Text>
              <strong>{patient.address || 'No Address'}</strong>
            </Text>
          </VStack>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default PatientDetail;

import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Select,
  VStack,
  Input,
  FlatList,
  Box,
  Text,
  Spinner,
  HStack,
  Center,
  useToast,
} from 'native-base';
import { useColorModeValue } from '../components/ColorModeContext';

const chemicalElements = [
  'Hidrogênio',
  'Oxigênio',
  'Hélio',
  'Neônio',
  'Argônio',
  'Criptônio',
  'Xenônio',
  'Radônio',
  'Oganessônio',
];

const Pergunta_Resposta = ({ navigation }) => {
  const { mode } = useColorModeValue();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [text, setText] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const toast = useToast();

  const handleReloadQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const [perguntaResponse, respostaResponse] = await Promise.all([
        fetch('https://apigametcc.azurewebsites.net/api/pergunta'),
        fetch('https://apigametcc.azurewebsites.net/api/resposta'),
      ]);

      if (!perguntaResponse.ok || !respostaResponse.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const perguntaData = await perguntaResponse.json();
      const respostaData = await respostaResponse.json();

      const perguntaComScore = perguntaData.map((pergunta, index) => {
        if (index < respostaData.length) {
          pergunta.score = respostaData[index].score;
        }
        return pergunta;
      });

      setQuestions(perguntaComScore);
      setAnswers(respostaData);
    } catch (error) {
      toast.show({ description: 'Erro ao carregar perguntas e respostas' });
    } finally {
      setLoadingQuestions(false);
    }
  }, [toast]);

  useEffect(() => {
    handleReloadQuestions();
  }, [handleReloadQuestions]);

  const handleAddQuestion = async () => {
    const data = { question: text, chemicalElement: selectedElement };
    await fetch('https://apigametcc.azurewebsites.net/api/pergunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    handleReloadQuestions();
    setText('');
    setSelectedElement('');
  };

  const handleUpdateQuestion = async () => {
    const data = { question: text, chemicalElement: selectedElement };
    const url = `https://apigametcc.azurewebsites.net/api/pergunta/${selectedId}`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    handleReloadQuestions();
    setText('');
    setSelectedElement('');
    setSelectedId(null);
  };

  const handleDeleteQuestion = async () => {
    const url = `https://apigametcc.azurewebsites.net/api/pergunta/${selectedId}`;
    await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    handleReloadQuestions();
    setShowConfirmButtons(false);
    setText('');
    setSelectedElement('');
    setSelectedId(null);
  };

  const handleSelectQuestion = (id, element, question) => {
    setSelectedId(id);
    setSelectedElement(element);
    setText(question);
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => {
    if (currentPage * pageSize < questions.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const paginatedQuestions = questions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Box
      bg={mode === 'light' ? 'coolGray.50' : 'coolGray.900'}
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <VStack space={4} width="80%" maxW="300px">
        <Button onPress={() => navigation.navigate('Menu')} mb={4}>Voltar ao Menu</Button>
        <Text>ID:</Text>
        <Input
          placeholder="ID"
          value={selectedId ? selectedId.toString() : ''}
          isReadOnly
        />
        <Text>Pergunta:</Text>
        <Input
          placeholder="Digite a pergunta"
          value={text}
          maxLength={300}
          onChangeText={setText}
        />
        <Text>Elemento Químico:</Text>
        <Select
          selectedValue={selectedElement}
          minWidth={200}
          accessibilityLabel="Selecione um elemento químico"
          placeholder="Selecione um elemento químico"
          onValueChange={setSelectedElement}
        >
          {chemicalElements.map((element, index) => (
            <Select.Item key={index} label={element} value={element} />
          ))}
        </Select>
        <HStack space={2}>
          <Button onPress={handleAddQuestion}>Adicionar</Button>
          <Button onPress={handleUpdateQuestion}>Atualizar</Button>
          <Button onPress={() => setShowConfirmButtons(true)}>Deletar</Button>
          {showConfirmButtons && (
            <>
              <Button colorScheme="red" onPress={handleDeleteQuestion}>Confirmar</Button>
              <Button onPress={() => setShowConfirmButtons(false)}>Cancelar</Button>
            </>
          )}
        </HStack>
        <Button onPress={handleReloadQuestions}>Gerar Perguntas/Respostas</Button>
      </VStack>

      {loadingQuestions ? (
        <Spinner accessibilityLabel="Carregando perguntas" />
      ) : (
        <FlatList
          data={paginatedQuestions}
          renderItem={({ item }) => (
            <Box
              p={4}
              borderWidth={1}
              borderColor={item.id === selectedId ? 'blue.500' : 'gray.200'}
              borderRadius="md"
              _even={{ backgroundColor: 'gray.100' }}
              _odd={{ backgroundColor: 'white' }}
              mb={2}
            >
              <Text fontWeight="bold">ID: {item.id}</Text>
              <Text>Pergunta: {item.question.replace(/(.{50})/g, '$1-\n')}</Text>
              <Text>Elemento Químico: {item.chemicalElement}</Text>
              <Text>{item.score === 1 ? 'Resultado: Acertou' : item.score === 0 ? 'Resultado: Errou' : ''}</Text>
              <Button onPress={() => handleSelectQuestion(item.id, item.chemicalElement, item.question)}>Selecionar</Button>
            </Box>
          )}
          keyExtractor={(item) => item.id.toString()}
          mb={4}
        />
      )}

      <HStack space={2} justifyContent="center">
        <Button onPress={handlePrevPage}>Página Anterior</Button>
        <Button onPress={handleNextPage}>Próxima Página</Button>
      </HStack>

      <Center mt={4}>
        <Text>Total de Acertos: {answers.reduce((total, answer) => total + (answer.score === 1 ? 1 : 0), 0)}</Text>
        <Text>Total de Erros: {answers.reduce((total, answer) => total + (answer.score === 0 ? 1 : 0), 0)}</Text>
      </Center>
    </Box>
  );
};

export default Pergunta_Resposta;

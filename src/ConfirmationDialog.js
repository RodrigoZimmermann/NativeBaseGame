import React from 'react';
import { Modal, VStack, Text, Button } from 'native-base';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Confirmação</Modal.Header>
        <Modal.Body>
          <Text>Tem certeza de que deseja deletar todas as perguntas? Esta ação não pode ser desfeita.</Text>
        </Modal.Body>
        <Modal.Footer>
          <VStack space={2} alignItems="flex-end">
            <Button colorScheme="red" onPress={onConfirm}>Confirmar</Button>
            <Button onPress={onClose}>Cancelar</Button>
          </VStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ConfirmationDialog;
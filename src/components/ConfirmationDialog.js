import React from 'react';
import { Modal, VStack, Text, Button, HStack } from 'native-base';

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
          <HStack space={2}>
            <Button colorScheme="red" onPress={onConfirm} accessibilityLabel="Confirmar deleção">
              Confirmar
            </Button>
            <Button variant="ghost" onPress={onClose} accessibilityLabel="Cancelar deleção">
              Cancelar
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ConfirmationDialog;

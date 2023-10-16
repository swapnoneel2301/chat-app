import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import UserBadgeItem from "./UserBadgeItem";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";

const UpdateGroupChatModal = () => {
  const {
    user,
    selectedChat: chat,
    setSelectedChat,
    fetchAgain,
    setFetchAgain,
  } = ChatState();

  const [grpName, setGrpName] = useState("");
  const [grpNameLoading, setGrpNameLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [serachResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(chat.users);
  const [updateMemberLoading, setUpdateMemberLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleFunction = () => {
    toast({
      title: "Not yet implemented the remove user feature.",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };
  const isGroupAdmin = () => {
    // if(chat.groupAdmin._id !== user._id) return fal
    return chat.groupAdmin._id === user._id;
  };
  const changeGrpName = async () => {
    if (!isGroupAdmin()) {
      toast({
        title: "Admin can only update",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (!grpName) {
      toast({
        title: "Please fill the Group Name",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setGrpNameLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const formData = {
        chatId: chat._id,
        chatName: grpName,
      };
      const { data } = await axios.put(`/api/chat/rename`, formData, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      // setChats([data, ...chats]);
      // onClose();
      setGrpName("");
      setGrpNameLoading(false);
      toast({
        title: "Grop Name Updated",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed Update the group name!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setGrpNameLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setSearchLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log(data);
      setSearchLoading(false);
      setSearchResult(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setSearchLoading(false);
    }
  };

  const handleAddMember = (userToAdd) => {
    // return;

    if (selectedUsers.find((user) => user._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const updateMember = () => {
    toast({
      title: "Not yet implemented the Update user feature.",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <>
      <IconButton icon={<EditIcon />} onClick={onOpen}>
        Open Modal
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{chat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl display="flex" mb="3">
              <Input
                placeholder="Change Group Name"
                value={grpName}
                onChange={(e) => setGrpName(e.target.value)}
              />
              <Button
                colorScheme="whatsapp"
                ml="2"
                onClick={changeGrpName}
                isLoading={grpNameLoading}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Sumana, Arindam, Kiran"
                value={search}
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={handleFunction}
                />
              ))}
            </Box>
            {searchLoading ? (
              <Spinner mx="auto" mt="4" display="flex" color="" />
            ) : (
              serachResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddMember(user)}
                  />
                ))
            )}
            <Button
              colorScheme="whatsapp"
              mt="2"
              onClick={updateMember}
              isLoading={updateMemberLoading}
              w="100%"
            >
              Update Member
            </Button>
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;

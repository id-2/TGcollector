import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Flex,
  Menu,
  Text,
} from "@mantine/core";
import { IconAlertCircle, IconDots } from "@tabler/icons";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "telegram";
import { apiLogout, setAskLogin } from "../../store/reducers/root";
import { ClientContext } from "../ClientProvider";

export default function AccountAction() {
  const dispatch = useDispatch();
  const client = useContext(ClientContext);
  const user = useSelector((state) => state.user);
  const openLogin = () => dispatch(setAskLogin(true));
  const [loading, setLoading] = useState(false);

  const logOut = async () => {
    if (!user.logged) return;

    setLoading(true);

    await client.invoke(new Api.auth.LogOut({}));

    dispatch(apiLogout());
    setLoading(false);
  };

  return (
    <>
      {!user.logged ? (
        <>
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Not logged in!"
            color="red"
            mb={"md"}
          >
            If you want to add channels or collect messages, you should log in
            to your Telegram account.
          </Alert>
          <Button onClick={openLogin} fullWidth>
            Login to Telegram
          </Button>
        </>
      ) : (
        <Card withBorder shadow="xs" sx={{ overflow: "visible" }} p={10}>
          <Flex align={"center"}>
            <div style={{ flex: 1 }}>
              <Text size="sm">
                Logged in as{" "}
                <Text component="span" weight={600}>
                  {user.userInfo?.firstName}
                </Text>
              </Text>

              <Text color="dimmed" size="sm">
                Phone: {user.userInfo?.phone}
              </Text>
            </div>
            <Menu shadow="xs" withArrow position="bottom-end">
              <Menu.Target>
                <ActionIcon color="indigo">
                  <IconDots size="1.25rem" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Button
                  w={160}
                  variant="light"
                  onClick={logOut}
                  loading={loading}
                  icon={<IconDots size={14} />}
                >
                  Log out
                </Button>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Card>
      )}
    </>
  );
}

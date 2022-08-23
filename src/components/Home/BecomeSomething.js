import { Box, Button, Container, Stack, Title, Center, Text, Image, SimpleGrid } from '@mantine/core';
import { button, custom } from '@/styles';

const BecomeSomething = () => {
  return (
    <Box sx={{...custom.graySection}}>
      <Container py={50}>
        <SimpleGrid cols={2} spacing={30}>
          <Stack spacing={30}>
            <Center>
              <Image src="/images/icon-donate.png" width={130} />
            </Center>
            <Title order={2} sx={{ textAlign: 'center' }}>Become a sponsor</Title>
            <Text color='#878c9b' sx={{ textAlign: 'center' }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit provident est vero vel dolorem facere eos aut odio, sapiente inventore.</Text>
            <Box>
              <Center>
                <Button
                  size='lg'
                  styles={() => ({
                    root: button.root
                  })}
                >
                  MAKE A DONATION
                </Button>
              </Center>
            </Box>
          </Stack>
          <Stack spacing={30}>
            <Center>
              <Image src="/images/icon-volunteer.png" width={130} />
            </Center>
            <Title order={2} sx={{ textAlign: 'center' }}>Get involved</Title>
            <Text color='#878c9b' sx={{ textAlign: 'center' }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum ea porro doloribus molestias recusandae in architecto tempora quis aliquam earum!</Text>
            <Box>
              <Center>
                <Button
                  size='lg'
                  styles={() => ({
                    root: button.root
                  })}
                >
                  BECOME A VOLUNTEER
                </Button>
              </Center>
            </Box>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default BecomeSomething;

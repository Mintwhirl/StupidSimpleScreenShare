import Chat from '../components/Chat';

export default {
  title: 'Components/Chat',
  component: Chat,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A real-time chat component with emoji picker, typing indicators, and message history.',
      },
    },
  },
  argTypes: {
    roomId: {
      control: 'text',
      description: 'The room ID for the chat session',
    },
    role: {
      control: 'select',
      options: ['host', 'viewer'],
      description: 'The role of the current user',
    },
    viewerId: {
      control: 'text',
      description: 'The viewer ID (for viewer role)',
    },
  },
};

export const Default = {
  args: {
    roomId: 'test-room-123',
    role: 'host',
    viewerId: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic chat interface with message input and history.',
      },
    },
  },
};

export const ViewerChat = {
  args: {
    roomId: 'test-room-123',
    role: 'viewer',
    viewerId: 'john-doe',
  },
  parameters: {
    docs: {
      description: {
        story: 'Chat interface for viewers with custom viewer ID.',
      },
    },
  },
};

export const WithMessages = {
  args: {
    roomId: 'test-room-123',
    role: 'host',
    viewerId: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chat interface with sample messages to demonstrate the UI.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '500px', width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const MobileChat = {
  args: {
    roomId: 'test-room-123',
    role: 'viewer',
    viewerId: 'mobile-user',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Chat interface optimized for mobile devices.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Story />
      </div>
    ),
  ],
};

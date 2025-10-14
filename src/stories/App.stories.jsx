import App from '../App';

export default {
  title: 'App/StupidSimpleScreenShare',
  component: App,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main application component with synthwave theme and screen sharing functionality.',
      },
    },
  },
  argTypes: {
    // No props to control since App is self-contained
  },
};

export const Default = {
  render: () => <App />,
  parameters: {
    docs: {
      description: {
        story: 'The default home view with all interactive controls and synthwave background.',
      },
    },
  },
};

export const MobileView = {
  render: () => <App />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'The application optimized for mobile devices with responsive design.',
      },
    },
  },
};

export const TabletView = {
  render: () => <App />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'The application on tablet-sized screens.',
      },
    },
  },
};

export const DesktopView = {
  render: () => <App />,
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'The application on desktop screens with full synthwave experience.',
      },
    },
  },
};

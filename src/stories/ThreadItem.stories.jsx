

import React from 'react';
import ThreadItem from '../components/ThreadItem';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Components/ThreadItem',
  component: ThreadItem,
  argTypes: {
    onVote: { action: 'voted' },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

const Template = (args) => <ThreadItem {...args} />;

export const LoggedInUserView = Template.bind({});
LoggedInUserView.args = {
  thread: {
    id: 'thread-1',
    title: 'Diskusi tentang React Hooks',
    body: 'React Hooks memungkinkan kita menggunakan state dan fitur React lainnya tanpa menulis sebuah kelas. Bagaimana pendapat kalian tentang ini?',
    category: 'react',
    createdAt: '2024-01-20T07:00:00.000Z',
    owner: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    },
    upVotesBy: ['user-2', 'user-3'],
    downVotesBy: [],
    totalComments: 5,
  },
  authUser: {
    id: 'user-1',
    name: 'John Doe',
  },
  onVote: (threadId, voteType) => {
    console.log('Vote clicked:', threadId, voteType);
  },
};

export const LoggedOutLongContent = Template.bind({});
LoggedOutLongContent.args = {
  thread: {
    id: 'thread-2',
    title: 'Perbandingan Framework JavaScript Modern',
    body: `Dalam pengembangan web modern, ada banyak framework JavaScript yang bisa kita pilih. React, Vue, Angular, dan Svelte adalah beberapa contoh populer.

    React, dikembangkan oleh Facebook, menawarkan pendekatan component-based yang powerful dengan Virtual DOM-nya.
    Vue menggabungkan hal terbaik dari React dan Angular, dengan kurva pembelajaran yang lebih landai.
    Angular memberikan solusi lengkap dengan TypeScript sebagai bahasa utamanya.
    Svelte mengambil pendekatan berbeda dengan melakukan kompilasi saat build time.

    Masing-masing memiliki kelebihan dan kekurangannya sendiri. Faktor apa yang menurut kalian paling penting dalam memilih framework?`,
    category: 'discussion',
    createdAt: '2024-01-19T15:30:00.000Z',
    owner: {
      id: 'user-4',
      name: 'Jane Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
    },
    upVotesBy: ['user-1', 'user-2', 'user-3', 'user-5'],
    downVotesBy: ['user-6'],
    totalComments: 12,
  },
  authUser: null,
  onVote: (threadId, voteType) => {
    console.log('Vote clicked:', threadId, voteType);
  },
};

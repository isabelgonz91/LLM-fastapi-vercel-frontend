"use client";
import Image from "next/image";
import Head from 'next/head'
import Layout from '../components/layout';
import ToDoList from '../components/todo-list';

export default function Home() {
  return (
    <Layout>
      <div>
        <Head>
          <title>Full Stack Book To Do</title>
          <meta name="description" content="Full Stack Book To Do" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ToDoList />
      </div>
    </Layout>
  )
}

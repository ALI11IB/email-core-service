import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

console.log('Elasticsearch ELASTICSEARCH_USERNAME:', process.env.ELASTICSEARCH_USERNAME);
console.log('Elasticsearch ELASTICSEARCH_PASSWORD:', process.env.ELASTICSEARCH_PASSWORD);
console.log('Elasticsearch ELASTICSEARCH_NODE:', process.env.ELASTICSEARCH_NODE);
const client = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME!,
    password: process.env.ELASTICSEARCH_PASSWORD!,
  },
  tls: {
    rejectUnauthorized: false, // If you are using self-signed certificates, you might need this option
  },
});

export default client;

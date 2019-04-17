const protocol = "http";
// const ip = '192.168.1.177';
const ip = '192.168.1.103';
// const ip = 'localhost';
const port = '9090';
const context = "artxls"

const baseUrl = protocol + "://" + ip + ":" + port + "/" + context + "/";

const attachmentContext = 'art-file';

const attachmentBaseUrl = protocol + "://" + ip + ":" + port + "/" + attachmentContext + "/";


export default{
	baseUrl,
	attachmentBaseUrl
}
import { validateRequestBodyJSON } from "@/lib/middlewares/validateRequestBodyJSON";
import { validateRequestContentType } from "@/lib/middlewares/validateRequestContentType";
import { validateXCSRFToken } from "@/lib/middlewares/validateXCSRFToken";
import { checkValidJWT } from "@/lib/utils/JWT";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Configuration as OpenAIConfiguration, OpenAIApi } from "openai";
export async function POST(request: Request) {
	// check xcsrf token on request header
	const xcsrfTokenError = await validateXCSRFToken(request);
	if (xcsrfTokenError) {
		return xcsrfTokenError;
	}

	// get user cookie from request header
	const cookieStore = cookies();
	const userCookie = cookieStore.get("user");

	if (!userCookie) {
		return NextResponse.json(
			{
				error: "Invalid credentials",
			},
			{ status: 400 }
		);
	}

	// decode user cookie
	const user = JSON.parse(userCookie.value);

	// validate user token
	const tokenReturn = checkValidJWT(user.token);

	if (!tokenReturn.valid) {
		return NextResponse.json(
			{
				error: tokenReturn.message,
			},
			{ status: 400 }
		);
	}

	// check request content type
	const contentTypeError = await validateRequestContentType(request);
	if (contentTypeError) {
		return contentTypeError;
	}

	// check request body is JSON
	const body = await validateRequestBodyJSON(request);
	if (!body) {
		return NextResponse.json(
			{
				error: "Invalid request. Please provide a valid JSON body",
			},
			{ status: 400 }
		);
	}

	// get the fields from the request body
	// fieldName is the name of the field to generate
	// startContent is the content to start the generation from
	// relativeContent is the content to generate relative to
	const { fieldName, startContent, relativeContent } = body;

	let promt;
	switch (fieldName) {
		case "title":
			if (startContent) {
				promt = `Inspire me with a title for a blog post, make it catchy and interesting. Note that we already have the partial title below (blend it as good as possible):\n\n${startContent}`;
			} else {
				promt = `Inspire me with a title for a blog post, make it catchy and interesting. Make the topic of the post random.`;
			}
			break;
		case "subtitle":
			promt = `Write a subtitle for a blog post, make it catchy and interesting. The title of the post is "${relativeContent}". The subtitle should be related to the title, but must not repeat words.`;
			break;
		case "content":
			promt = `Write an article for a blog about "${relativeContent}". The article should have a compelling introduction, followed by at least three paragraphs of informative and well-researched content on the subject. Please include relevant examples and, if possible, up-to-date statistics. The tone should be friendly and accessible to the reader, but also grammarly correct. Feel free to add relevant links to external sources, but ensure that all information used is accurate, reliable (add the source). Additionally, please use HTML tags in the article to format the text.`;
			if (startContent) {
				promt = `${promt} Note that we already have the partial text below (blend it as good as possible, and correct grammar in it):\n\n${startContent}`;
			}
			break;
		case "metaDescription":
			promt = `Write a meta description using this content (use a maximum of 120 characters): \n\n${relativeContent}`;
			break;
	}

	const apiKey = process.env.OPENAI_API_KEY;
	const model = process.env.GPT_MODEL as string;

	const configuration = new OpenAIConfiguration({
		apiKey,
	});

	const openai = new OpenAIApi(configuration);

	try {
		const chatCompletion = await openai.createChatCompletion({
			model,
			messages: [{ role: "user", content: promt }],
		});
		return NextResponse.json(
			{
				message: chatCompletion.data.choices[0].message,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{
				error: error.response,
			},
			{ status: 400 }
		);
	}
}

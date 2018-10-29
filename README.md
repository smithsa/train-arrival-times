# Train Tracker (Alexa Skill)

This is an Alexa skill that uses the CTA Train Tracker API to predict arrival times based on station. I created this for personal use.

[View Demo]()

## Prerequisites
*  [Node.js (4.5 or greater)](https://nodejs.org)
*  [Node Package Manager (npm)](https://www.npmjs.com/)
*  [AWS Account](https://aws.amazon.com/getting-started/) - You will need to use [Lambda](https://aws.amazon.com/lambda/), [DynamoDB](https://aws.amazon.com/dynamodb/), and access to the [Alexa Skills Kit Developer Console](https://developer.amazon.com/alexa/console/ask)

## Installation

1. Set up AWS IAM user. An AWS account is required since the skill will use Lambda. Additionally, you will need an AWS IAM user. Ensure that your AWS credentials are set up with the appropriate permissions on the computer to which you are installing ASK CLI. For more information on this step see Amazon's documentation: [Set Up Credentials for an Amazon Web Services (AWS) Account](https://developer.amazon.com/docs/smapi/set-up-credentials-for-an-amazon-web-services-account.html).

2. Install ASK CLI. Please reference Amazon's ["Quick Start Alexa Skills Kit Command Line Interface"](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) if you are having trouble with this step.
	```
	npm install -g ask-cli
	```

3. Initialize ASK CLI
	```
	ask init
	```

4. Create a new skill project. The newly created skill project folder will contain all necessary files to deploy it with minimal changes. You will replace these files with those in the repository eventually.
	```
	ask new
	```

5. Clone the Train Tracker  project
	```
	git clone git@github.com:smithsa/train-arrival-times.git
	```

6. Navigate to `lambda/custom` directory
    ```
    cd train-arrival-times/lambda/custom
    ```

7. Rename `config-example.js` to `config.js`
    ```
    mv  config-example.js config.js
    ```

8. Edit the contents of the file that is now config.js. Set the appropriate values for API_KEY and STATION CODE. You can reference the [Chicago Train Authority Transit Tracker API](https://www.transitchicago.com/assets/1/6/cta_Train_Tracker_API_Developer_Guide_and_Documentation.pdf) for more information.

9. Copy contents of the newly cloned repository into the project you created at step 4.

10. Navigate to `lambda/custom` within the new project
    ```
    cd your-project-name/lambda/custom
    ```

11. Now install node packages
    ```
    npm install
    ```

12. Ensure the name of the skill you used for step 4 matches in "skill.json." Additionally, set invocation name in models/en-US.json.

13. Deploy the code to AWS Lambda
	```
	ask deploy
	```

## Usage

You can test and run the skill through the command line or the Alexa Skills Kit Developer Console.

**Command Line**

Run the command below. For more information on this command refer to Alexa's [Simulate Command Documentaiton](https://developer.amazon.com/docs/smapi/ask-cli-command-reference.html#simulate-command)
```
ask simulate -t [insert command here]
```

**Alexa Skills Kit Developer Console**

You can navigate to the [Alexa Skills Kit Developer Console](https://developer.amazon.com/alexa/console/ask). Select the skill you are workig on, and select the "Test" tab menu item at the top of the page. You can open the skill by typing "open [your skill name]." You can enter any other commands as well.

Refer to Amazon's [Alexa Skills Kit Developer Console: Test](https://www.youtube.com/watch?v=lYImJ2H__BY) video from more instruction on how to test withing the console.

To understand the commands you can give the skill watch the [view demo]().

## Built With
*  [ASK SDK v2](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs)
*  [Node](https://nodejs.org)
*  [AWS Lambda](https://aws.amazon.com/lambda/)

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/order */
// @ts-nocheck
import dynamic from "next/dynamic";
import { Form } from "lib/form/core";
import { registerCoreBlocks } from "lib/form/utils";

registerCoreBlocks();

function TriageForm() {
  return (
    <div className="questionForm">
      <Form
        formId="1"
        formObj={{
          blocks: [
            {
              name: "short-text",
              id: "patientName",
              attributes: {
                required: true,
                label: "Guest's name",
              },
            },
            {
              name: "number",
              id: "patientAge",
              attributes: {
                required: true,
                label: "{{field:patientName}}'s age?",
              },
            },
            {
              name: "multiple-choice",
              id: "patientGender",
              attributes: {
                required: true,
                multiple: false,
                verticalAlign: false,
                label: "{{field:patientName}}'s gender?",
                choices: [
                  {
                    label: "Female",
                    value: "female",
                  },
                  {
                    label: "Male",
                    value: "male",
                  },
                  {
                    label: "Other",
                    value: "other",
                  },
                ],
              },
            },
            {
              name: "multiple-choice",
              id: "status",
              attributes: {
                required: true,
                multiple: false,
                verticalAlign: false,
                label: "{{field:patientName}}'s status?",
                choices: [
                  {
                    label: "Emergency",
                    value: "emergency",
                  },
                  {
                    label: "Non Emergency",
                    value: "nonemergency",
                  },
                ],
              },
            },
          ],
        }}
        onSubmit={() => {
          // console.log(data);
        }}
      />
    </div>
  );
}

export default dynamic(() => Promise.resolve(TriageForm), {
  ssr: false,
});

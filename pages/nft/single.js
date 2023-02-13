import React from 'react'
import { useState } from 'react'

const single = () => {
    const [name, setName] = useState("");
    const [externalLink, setExternalLink] = useState("");
    const [fileUrl, setFileUrl] = useState();
    const [imageFile, setImageFile] = useState();
    const [description, setDescription] = useState("");
    const [attributesList, setAttributesList] = useState([
        { trait_type: "", value: "" },
      ]);

      const handleImageFile = (e) => {
        const file = e.target.files[0];
        setFileUrl(URL.createObjectURL(file));
        setImageFile(file);
      };
    
      const handleNameChange = (e) => {
        setName(e.target.value);
      };
    
      const handleExternalLinkChange = (e) => {
        setExternalLink(e.target.value);
      };
    
      const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
      };

      const handleAttributeChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...attributesList];
        list[index][name] = value;
        setAttributesList(list);
      };
    
      const handleAttributeRemove = (index) => {
        const list = [...attributesList];
        list.splice(index, 1);
        setAttributesList(list);
      };
    
      const handleAttributeAdd = () => {
        setAttributesList([...attributesList, { trait_type: "", value: "" }]);
      };

      const inputStyle =
    "form-control bg-transparent block w-full px-3 py-1.5 text-base font-normal text-gray-200 bg-clip-padding border-2 border-solid border-neutral-700 rounded transition ease-in-out m-0 focus:text-white  focus:border-gray-400 focus:outline-none";

  return (
    <div className="px-64 py-10">
        <form>
        <div className="flex">
              <div>
                <div className="m-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-96 h-80 border-4 border-neutral-700 border-dashed hover:bg-neutral-200 rounded-xl">
                      <div className="flex flex-col items-center m-auto">
                        {fileUrl != undefined ? (
                          <div className="hover:bg-gray-100 hover:border-gray-300">
                            <img
                              src={fileUrl}
                              className="object-fill h-80 w-96 rounded-xl p-1 "
                            />
                          </div>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-8 h-8 group-hover:text-gray-200"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="pt-1 text-sm tracking-wider group-hover:text-gray-200">
                              Attach a file
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="opacity-0"
                        onChange={handleImageFile}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Box- Name */}
            <h2 className=" font-bold text-xl pt-5 ">
              Name<span className=" text-red-600"> *</span>
            </h2>
            <input
              type="text"
              onChange={(e) => handleNameChange(e)}
              className={inputStyle}
              id="exampleFormControlInput1"
              placeholder="Item Name"
            />

            {/* Input Box- External Link */}
            <h2 className=" font-bold text-xl pt-8 ">
              External Link
            </h2>
            <input
              type="text"
              onChange={(e) => handleExternalLinkChange(e)}
              className={inputStyle}
              id="exampleFormControlInput1"
              placeholder="External Link"
            />

            {/* Input Box- Description */}
            <h2 className=" font-bold text-xl pt-8 ">Description</h2>
            <input
              type="text"
              onChange={(e) => handleDescriptionChange(e)}
              className={inputStyle}
              id="exampleFormControlInput1"
              placeholder="Description"
            />

            {/* Attributes */}
            <h2 className=" font-bold text-xl pt-8 ">Attributes</h2>

            <div className="flex flex-col">
              {attributesList.map((singleAttribute, index) => (
                <div key={index} className="flex justify-between pt-5">
                  <div className="first-division">
                    <div className="flex gap-10">
                      {/* Input box - Attribute type*/}
                      <input
                        name="trait_type"
                        type="text"
                        value={singleAttribute.trait_type}
                        onChange={(e) => handleAttributeChange(e, index)}
                        className={inputStyle}
                        placeholder={`Type #${index}`}
                      />

                      {/* Input box - Attribute value */}
                      <input
                        name="value"
                        type="text"
                        value={singleAttribute.value}
                        onChange={(e) => handleAttributeChange(e, index)}
                        className={inputStyle}
                        placeholder={`Value #${index}`}
                      />
                    </div>

                    {attributesList.length - 1 === index &&
                      attributesList.length < 20 && (
                        <button
                          type="button"
                          onClick={handleAttributeAdd}
                          className="mt-5 text-violet-900 border border-violet-500 hover:bg-violet-500 hover:text-white p-3 rounded-lg"
                        >
                          <span>Add an Attribute</span>
                        </button>
                      )}
                  </div>
                  <div className="second-division">
                    {attributesList.length !== 1 && (
                      <button
                        type="button"
                        onClick={() => handleAttributeRemove(index)}
                        className="text-red-500 border border-red-300 hover:bg-red-500 hover:text-white p-3 rounded-lg"
                      >
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white border border-green-600 bg-green-600 hover:bg-green-800 px-10 py-3 rounded-full mt-10"
              >
                <span>Create</span>
              </button>
            </div>

        </form>
    </div>
  )
}

export default single
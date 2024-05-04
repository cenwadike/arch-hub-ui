export default function ProfileBaord() {
    return (
        <>
          <div>
            <div className="flex flex-row justify-end items-center md:pr-28 mt-10 pr-6">
                <p className="bg-orange-600 rounded-xl text-white p-2"> domain_name</p>
            </div>

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Skills
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>technical writing</p>
                      <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                      <p className='text-gray-900 text-base mb-2'>Copy writing</p>
                      <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                      <p className='text-gray-900 text-base mb-2'>Social media marketing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Preference
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>Remote</p>
                      <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                      <p className='text-gray-900 text-base mb-2'>Contract</p>
                      <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                      <p className='text-gray-900 text-base mb-2'>$30/hr</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}

            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-24'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Employment Status
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>Open to work</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
        </>
    );
}
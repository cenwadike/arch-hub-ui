// TODO: add review to IPFS and push onchain
// TODO: view job review by job ID
export default function ReviewBoard() {
    return (
        <>
          <div className="md:w-12/12">
            <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-6'>
              <div className='block p-2 mx-8 rounded-lg border border-orange-600 bg-inherit bg-opacity-100'>
                <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                  <div className='inline-flex flex-col justify-start items-start'>
                    <div className='flex justify-start'>
                      <h className='text-orange-600 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                        {" "}
                        Client review
                      </h>
                    </div>
                    <div className='inline-flex flex-row'>
                      <p className='text-gray-900 text-base mb-2'>Contract went smoo...</p>
                    </div>
                  </div>
      
                  <div className='inline-flex flex-col'>
                    <p className='text-gray-900 text-base mb-2'></p>
                    <p className='text-blue-600 text-base mb-2'>read &rarr;</p>
                  </div>
                </div>
              </div>
            </div>{" "}
          </div>
        </>
    );
}
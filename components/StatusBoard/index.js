export default function StatusBoard() {
    return (
        <>
          <div className='flex flex-row justify-center items-center md:ml-44 mt-8 ml-6'>
            <div className='block p-2 mx-8 rounded-lg border border-slate-800 bg-inherit bg-opacity-100'>
              <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                <div className='inline-flex flex-col justify-start items-start '>
                  <div className='flex justify-start'>
                    <h className='text-gray-200 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                      {" "}
                      Airtime purchase
                    </h>
                  </div>
                  <div className='inline-flex flex-row'>
                    <p className='text-gray-400 text-base mb-2'>Dec 28, 2022</p>
                    <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                    <p className='text-gray-400 text-base mb-2'>12:30</p>
                  </div>
                </div>
    
                <div className='inline-flex flex-col'>
                  <p className='text-gray-400 text-base mb-2'>&#8358;500</p>
                  <p className='text-gray-400 text-base mb-2'>MTN</p>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-6'>
            <div className='block p-2 mx-8 rounded-lg border border-slate-800 bg-inherit bg-opacity-100'>
              <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                <div className='inline-flex flex-col justify-start items-start'>
                  <div className='flex justify-start'>
                    <h className='text-gray-200 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                      {" "}
                      Data purchase
                    </h>
                  </div>
                  <div className='inline-flex flex-row'>
                    <p className='text-gray-400 text-base mb-2'>Dec 21, 2022</p>
                    <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                    <p className='text-gray-400 text-base mb-2'>12:30</p>
                  </div>
                </div>
    
                <div className='inline-flex flex-col'>
                  <p className='text-gray-400 text-base mb-2'>&#8358;500</p>
                  <p className='text-gray-400 text-base mb-2'>Glo</p>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className='flex flex-row justify-center items-center md:ml-44 mt-12 ml-6'>
            <div className='block p-2 mx-8 rounded-lg border border-slate-800 bg-inherit bg-opacity-100'>
              <div className='block pt-0 px-2 w-72 md:w-[36rem]'>
                <div className='inline-flex flex-col justify-start items-start'>
                  <div className='flex justify-start'>
                    <h className='text-gray-200 text-md font-semibold leading-tight mb-2 mr-24 md:mr-96'>
                      {" "}
                      Tv subscription
                    </h>
                  </div>
                  <div className='inline-flex flex-row'>
                    <p className='text-gray-400 text-base mb-2'>Dec 18, 2022</p>
                    <hr className=' border border-gray-200 h-6 mx-2 md:mx-4'></hr>
                    <p className='text-gray-400 text-base mb-2'>12:30</p>
                  </div>
                </div>
    
                <div className='inline-flex flex-col'>
                  <p className='text-gray-400 text-base mb-2'>&#8358;4200</p>
                  <p className='text-gray-400 text-base mb-2'>goTv</p>
                </div>
              </div>
            </div>
          </div>{" "}
        </>
    );
}
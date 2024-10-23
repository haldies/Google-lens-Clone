
import ImageExample from '../assets/bf7caade-3d9d-4304-af3d-f571d2724c99baju.jpg';
const SkeletonLoader = () => {
    const randomPosition = () => `${Math.random() * 100}%`;
    return (
        <div className=' justify-center flex border  py-40 '>
            <div className="px-6 py-24 bg-[#202124] flex flex-col  items-center space-y-6 rounded-xl">
                <div className="border rounded-3xl p-2  w-64 ">
                    <h1 className="text-white  text-center font-semibold">Cari sumber Produk</h1>
                </div>
                <div className="w-96 h-96 flex items-center justify-center relative">
                    <div>
                        <img src={ImageExample} alt="" />
                    </div>
                    <div className="absolute w-full h-full ">
                        {[...Array(10)].map((_, index) => (
                            <div
                                key={index}
                                className="absolute rounded-full bg-white animate-ping-slow duration-500"
                                style={{
                                    width: '7px',
                                    height: '7px',
                                    left: randomPosition(),
                                    top: randomPosition(),
                                    animationDelay: `-${index * 0.1}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>

    );
};

export default SkeletonLoader;

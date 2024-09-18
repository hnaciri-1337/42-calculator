import { useState, useEffect, useRef } from 'react'
import { InputNumber, Tour, Select, Button, notification } from 'antd'
import projectsInformations from './assets/projectsInformations.json'
import levelsInformations from './assets/LevelsInformations.json'
import levelImage from './assets/level.png'

const	projectData = projectsInformations.map(({id, name}) => ({value: id, label: name}));
const	TOTALBLACKHOLEDAYS = 670 - 77;

function App() {
	const	[level, setLevel] = useState('0.0');
	const	[project, setProject] = useState(-1);
	const	[mark, setMark] = useState(0);
	const	[coalitionsBonus, setCoalitionsBonus] = useState(0);
	const	[expectedLevel, setExpectedLevel] = useState(0);
	const	[blackHoleDays, setBlackHoleDays] = useState(0);
	const	[beginTour, setBeginTour] = useState(false);

	const	ref1 = useRef(null);
	const	ref2 = useRef(null);
	const	ref3 = useRef(null);
	const	ref4 = useRef(null);
	const	ref5 = useRef(null);

	const [api, contextHolder] = notification.useNotification();
	const openNotification = (message) => {
		api.error({
			message: `Error`,
			description: message,
			placement: 'top',
		});
	};

	useEffect(() =>{
		const isFirstVisit = !localStorage.getItem('visitedBefore');
		console.log (isFirstVisit);
		if (isFirstVisit) {
			setBeginTour(true);
			localStorage.setItem('visitedBefore', 'true');
		}
	}, []);

	const	getLevel = () => {
		var [levelIntegerPart, levelDecimalPart] = level.split('.').map((part, index) => (index === 1 ? Number(part.padEnd(2, '0')) : Number(part)));
		if (levelDecimalPart == undefined) {
			levelDecimalPart = 0;
		}
		return [levelIntegerPart, levelDecimalPart];
	}

	const	getProjectXp = () => {
		var	projectXp = projectsInformations.filter(({id}) => id == project)[0].difficulty;
		projectXp = projectXp * mark / 100;
		projectXp += (projectXp * 4.2 / 100 * coalitionsBonus);
		return (projectXp);
	}

	const	calculateLevel = () => {
		if (project === -1 || project === undefined) {
			openNotification('Please select a project');
			return ;
		}
		const	maxXpForBlackHole = levelsInformations[8].xp + (((levelsInformations[8 + 1].xp - levelsInformations[8].xp) * 41) / 100);
		const	[levelIntegerPart, levelDecimalPart] = getLevel();
		const	currentXp = levelsInformations[levelIntegerPart].xp + (((levelsInformations[levelIntegerPart + 1].xp - levelsInformations[levelIntegerPart].xp) * levelDecimalPart) / 100);
		const	nextXp = getProjectXp() + currentXp;
		const	nextLevel = levelsInformations.find(({xp}) => xp > nextXp).lvl - 1;

		setExpectedLevel(nextLevel + (nextXp - levelsInformations[nextLevel].xp) / (levelsInformations[nextLevel + 1].xp - levelsInformations[nextLevel].xp));
		setBlackHoleDays((Math.pow((Math.min(nextXp, maxXpForBlackHole)) / maxXpForBlackHole, 0.45) - Math.pow(Math.min(currentXp, maxXpForBlackHole) / maxXpForBlackHole, 0.45)) * TOTALBLACKHOLEDAYS);
	}

	const steps = [
		{
			title: 'Step 1',
			description: 'Enter your 42Cursus level !!',
			cover: (
				<img
					alt="level.png"
					src={levelImage}
				/>
			),
			target: () => ref1.current,
		},
		{
			title: 'Step 2',
			description: 'Pick a project from the list',
			target: () => ref2.current,
		},
		{
			title: 'Step 3',
			description: 'Enter your expected validation mark !',
			target: () => ref3.current,
		},
		{
			title: 'Step 4',
			description: 'If you are in the first coalition chose yes to get the 4.2 bonus !',
			target: () => ref4.current,
		},
		{
			title: 'Finally',
			description: 'Click here and get the results !',
			target: () => ref5.current,
		},
	];

	return (
		<>
			{contextHolder}
			<div className="w-full h-full flex flex-col justify-center items-center">
				<h1 className="text-3xl lg:text-6xl md:text-4xl font-bold text-sky-600 drop-shadow-2xl">
					42 - Level calculator
				</h1>
				<br />
				<div className='flex flex-col w-3/4'>
					<div className='flex flex-col lg:flex-row md:flex-row w-full justify-evenly'>
						<div className='flex flex-row justify-between m-4 lg:flex-col md:flex-col w-full lg:w-1/6 md:w-1/6' ref={ref1}>
							<label htmlFor="level" className='text-green-400'>
								Level
							</label>
							<InputNumber
								className='w-2/3 lg:w-full md:w-full shadow-md drop-shadow-2xl'
								placeholder='Level'
								value={level}
								onChange={setLevel}
								min="0"
								max="25"
								step="0.01"
								stringMode
								inputMode='numeric'
								name='level'
								precision={2}
							/>
						</div>
						<div className='flex flex-row justify-between m-4 lg:flex-col md:flex-col  w-full lg:w-1/3 md:w-1/3' ref={ref2}>
							<label htmlFor="project" className='text-green-400'>
								Project
							</label>
							<Select
								showSearch
								className='w-2/3 lg:w-full md:w-full shadow-md drop-shadow-2xl'
								placeholder="Project name"
								filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
								onChange={setProject}
								options={projectData}
								allowClear={true}
							/>
						</div>
						<div className='flex flex-row justify-between m-4 lg:flex-col md:flex-col w-full lg:w-1/6 md:w-1/6' ref={ref3}>
							<label htmlFor="mark" className='text-green-400'>
								Mark
							</label>
							<InputNumber
								className='w-2/3 lg:w-full md:w-full shadow-md drop-shadow-2xl'
								placeholder='Mark'
								inputMode='numeric'
								value={mark}
								onChange={setMark}
								min={0}
								max={125}
								step={1}
								name='mark'
							/>
						</div>
						<div className='flex flex-row justify-between m-4 lg:flex-col md:flex-col  w-full md:min-w-fit md:w-1/6 lg:min-w-fit lg:w-1/6' ref={ref4}>
							<label htmlFor="coalitions-bonus" className='text-green-400'>
								Coalition bonus
							</label>
							<Select
								className='w-2/3 lg:w-full md:w-full shadow-md drop-shadow-2xl'
								placeholder='1st coalition'
								value={coalitionsBonus}
								options={[
									{
										value: 0,
										label: 'No'
									},
									{
										value: 1,
										label: 'Yes'
									}
								]}
								name='coalitions-bonus'
								onChange={setCoalitionsBonus}
							/>
						</div>
					</div>
					<br />
					<div className='w-full flex flex-row justify-center'>
						<Button type="primary" className='w-fit bg-sky-600 hover:bg-sky-400 cursor-pointer' onClick={calculateLevel} ref={ref5} >Calculate</Button>
					</div>
				</div>
				<br />
				<div className='w-full lg:w-3/4 md:w-3/4 flex flex-row justify-around lg:justify-evenly md:justify-evenly'>
					<div className='flex flex-col'>
						<h1 className='text-green-400 text-md lg:text-xl md:text-xl font-bold'> Expected level </h1>
						<p className='text-md lg:text-xl md:text-xl text-white self-center'> {expectedLevel.toFixed(2)} </p>
					</div>
					<div className='flex flex-col'>
						<h1 className='text-green-400 text-md lg:text-xl md:text-xl font-bold'> Black hole days earned </h1>
						<p className='text-md lg:text-xl md:text-xl text-white self-center'> {blackHoleDays.toFixed(2)} </p>
					</div>
				</div>
			</div>
			<Tour open={beginTour} onClose={() => setBeginTour(false)} steps={steps} />
		</>
	)
}

export default App

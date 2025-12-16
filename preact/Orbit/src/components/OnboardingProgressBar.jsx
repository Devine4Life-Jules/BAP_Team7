export default function OnboardingProgressBar({step}) {
    const circles = [1, 2, 3];

    return (
        <div className="onboardingProgressBar" style={{
          display: 'flex', 
          gap: '0.5rem',
          position: 'absolute',
          bottom: '10rem',
          }}>
          {circles.map((key) => (
            <div 
              key={key} 
              className="circleOnboarding" 
              style={{backgroundColor: key > step ? 'gray' : 'white'}}
            ></div>
          ))}
        </div>
    )

}
# TypeScript & React Cheatsheet

## Component & Hook Patterns
- **React Functional Component Template** (`const Component: React.FC<Props> = ({ prop }) => { return <div>{prop}</div>; }`): Standard typed functional component definition in TypeScript.
- **useState Hook with Type** (`const [state, setState] = useState<string>('');`): Declares a typed state variable with initial value.
- **useEffect Hook** (`useEffect(() => { /* effect */ return () => { /* cleanup */ }; }, [deps]);`): Handles side effects and optional cleanup on unmount.

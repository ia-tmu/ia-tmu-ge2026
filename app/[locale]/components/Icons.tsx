interface IconProps {
  width: number;
  height: number;
  color?: string;
  className?: string;
}

export const ExternalLinkIcon = ({
  width,
  height,
  color = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 15 15"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const PersonIcon = ({
  width,
  height,
  color = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 15 15"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const ChevronLeftIcon = ({
  width,
  height,
  color = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
};

export const ChevronRightIcon = ({
  width,
  height,
  color = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
};

export const ChevronUpIcon = ({
  width,
  height,
  color = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
};

export const ChevronDownIcon = ({
  width,
  height,
  color = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
};

export const CrossLargeIcon = ({
  width,
  height,
  color = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 15 15"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const ArrowIcon = ({
  width,
  height,
  color = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 19 15"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M0.293856 6.64159C-0.0966665 7.03127 -0.0966665 7.66443 0.293856 8.0558L6.6578 14.4335C7.04833 14.8249 7.68149 14.8262 8.07201 14.4366C8.46254 14.0469 8.46254 13.4137 8.07201 13.0224L2.41517 7.35328L8.07201 1.70864C8.46254 1.31896 8.46254 0.685798 8.07201 0.29443C7.68149 -0.096938 7.04833 -0.098306 6.6578 0.291375L0.293856 6.64159ZM18.6992 7.38846L18.6992 6.38846L1.00096 6.35022L1.00096 7.35022L1.00096 8.35022L18.6992 8.38846L18.6992 7.38846Z" />
    </svg>
  );
};

export const BackIcon = ({
  width,
  height,
  color = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 15 15"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.81809 4.18179C8.99383 4.35753 8.99383 4.64245 8.81809 4.81819L6.13629 7.49999L8.81809 10.1818C8.99383 10.3575 8.99383 10.6424 8.81809 10.8182C8.64236 10.9939 8.35743 10.9939 8.1817 10.8182L5.1817 7.81819C5.09731 7.73379 5.0499 7.61933 5.0499 7.49999C5.0499 7.38064 5.09731 7.26618 5.1817 7.18179L8.1817 4.18179C8.35743 4.00605 8.64236 4.00605 8.81809 4.18179Z"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

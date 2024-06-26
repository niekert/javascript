import { useClerk } from '@clerk/clerk-react';
import * as Common from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';

import { EmailField } from '~/common/email-field';
import { OTPField } from '~/common/otp-field';
import { PasswordField } from '~/common/password-field';
import { PhoneNumberField } from '~/common/phone-number-field';
import { PROVIDERS } from '~/constants';
import { Button } from '~/primitives/button';
import * as Card from '~/primitives/card';
import * as Connection from '~/primitives/connection';
import * as Icon from '~/primitives/icon';
import { Seperator } from '~/primitives/seperator';
import { getEnabledSocialConnectionsFromEnvironment } from '~/utils/getEnabledSocialConnectionsFromEnvironment';

export function SignInComponent() {
  const clerk = useClerk();
  // @ts-ignore clerk is not null
  const enabledConnections = getEnabledSocialConnectionsFromEnvironment(clerk?.__unstable__environment);

  return (
    <SignIn.Root>
      <Common.Loading>
        {isGlobalLoading => {
          return (
            <SignIn.Step name='start'>
              <Card.Root>
                <Card.Content>
                  <Card.Header>
                    <Card.Title>Sign in to Acme Corp</Card.Title>
                    <Card.Description>Welcome back! Please sign in to continue</Card.Description>
                  </Card.Header>

                  <Card.Body>
                    <Connection.Root>
                      {enabledConnections.map(c => {
                        const connection = PROVIDERS.find(provider => provider.id === c.provider);
                        const iconKey = connection?.icon;
                        const IconComponent = iconKey ? Icon[iconKey] : null;
                        return (
                          <Common.Connection
                            key={c.provider}
                            name={c.provider}
                            asChild
                          >
                            <Common.Loading scope={`provider:${c.provider}`}>
                              {isConnectionLoading => {
                                return (
                                  <Connection.Button
                                    busy={isConnectionLoading}
                                    disabled={isGlobalLoading || isConnectionLoading}
                                    icon={IconComponent ? <IconComponent className='text-base' /> : null}
                                    textVisuallyHidden={enabledConnections.length > 2}
                                  >
                                    {connection?.name || c.provider}
                                  </Connection.Button>
                                );
                              }}
                            </Common.Loading>
                          </Common.Connection>
                        );
                      })}
                    </Connection.Root>
                    <Seperator>or</Seperator>
                    <div className='flex flex-col gap-4'>
                      {/* @ts-ignore Expected https://github.com/clerk/javascript/blob/12f78491d6b10f2be63891f8a7f76fc6acf37c00/packages/clerk-js/src/ui/elements/PhoneInput/PhoneInput.tsx#L248-L249 */}
                      <PhoneNumberField locationBasedCountryIso={clerk.__internal_country} />
                      <EmailField disabled={isGlobalLoading} />
                      <PasswordField disabled={isGlobalLoading} />
                      <OTPField
                        disabled={isGlobalLoading}
                        // TODO:
                        // 1. Replace `button` with `SignIn.Action` when `exampleMode` is removed
                        // 2. Replace `button` with consolidated styles (tackled later)
                        resend={
                          <>
                            Didn&apos;t recieve a code?{' '}
                            <button
                              type='button'
                              className='text-accent-9 focus-visible:ring-default -mx-0.5 rounded-sm px-0.5 font-medium outline-none hover:underline focus-visible:ring-2'
                            >
                              Resend
                            </button>
                          </>
                        }
                      />
                    </div>

                    <SignIn.Action
                      submit
                      asChild
                    >
                      <Common.Loading>
                        {isSubmitting => {
                          return (
                            <Button
                              icon={<Icon.CaretRight />}
                              busy={isSubmitting}
                              disabled={isGlobalLoading || isSubmitting}
                            >
                              Continue
                            </Button>
                          );
                        }}
                      </Common.Loading>
                    </SignIn.Action>
                  </Card.Body>
                </Card.Content>

                <Card.Footer>
                  <Card.FooterAction>
                    <Card.FooterActionText>
                      Don&apos;t have an account? <Card.FooterActionLink href='/sign-up'>Sign up</Card.FooterActionLink>
                    </Card.FooterActionText>
                  </Card.FooterAction>
                </Card.Footer>
              </Card.Root>
            </SignIn.Step>
          );
        }}
      </Common.Loading>
    </SignIn.Root>
  );
}
